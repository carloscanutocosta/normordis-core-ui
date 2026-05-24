import { base44 } from "@/api/base44Client";

// ── Interpolate {{field}} variables ───────────────────────────────────────
function interpolate(template = "", record = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === "created_date" && record.created_date) {
      return new Date(record.created_date).toLocaleDateString("pt-PT");
    }
    return String(record[key] ?? "");
  });
}

// ── Send notifications for a given trigger ────────────────────────────────
export async function triggerAutomation(triggerType, record) {
  let rules = [];
  try {
    rules = await base44.entities.AutomationRule.filter({
      trigger: triggerType,
      is_active: true,
    });
  } catch {
    return { sent: 0, errors: [] };
  }

  if (!rules?.length) return { sent: 0, errors: [] };

  let sent = 0;
  const errors = [];

  for (const rule of rules) {
    const subject = interpolate(rule.subject_template, record);
    const body    = interpolate(rule.body_template, record);
    const emails  = String(rule.recipient_emails ?? "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    for (const email of emails) {
      try {
        await base44.integrations.Core.SendEmail({ to: email, subject, body });
        sent++;
      } catch (err) {
        errors.push({ email, error: err?.message ?? "Unknown error" });
      }
    }

    // Update stats
    try {
      await base44.entities.AutomationRule.update(rule.id, {
        last_triggered_at: new Date().toISOString(),
        trigger_count: (Number(rule.trigger_count) || 0) + emails.length,
      });
    } catch { /* non-critical */ }
  }

  return { sent, errors };
}

// Convenience wrappers
export const notifyRecordCreated   = (record) => triggerAutomation("record_created",   record);
export const notifyStatusCompleted = (record) => triggerAutomation("status_completed", record);