import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, User, Phone, Globe } from 'lucide-react';

import {
  TextInput,
  NumberInput,
  TextAreaInput,
  DateInput,
  DateTimeInput,
  SelectInput,
  MultiSelectInput,
  CheckboxInput,
  SwitchInput,
  RadioGroupInput,
  SliderInput,
  TagsInput,
  RichTextInput,
  FileUploadInput,
  PasswordInput,
  SearchInput,
  ColorInput,
  OTPInput,
  RatingInput,
  PhoneInput,
  CurrencyInput,
  TimeRangeInput,
  ToggleGroupInput,
} from '../forms';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function InputsSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    url: '',
    password: '',
    search: '',
    amount: '',
    quantity: 1,
    percentage: 50,
    description: '',
    date: '',
    datetime: '',
    time: '',
    category: '',
    tags: ['React', 'Tailwind'],
    multiSelect: [],
    checkbox: false,
    switch: true,
    radio: 'option1',
    color: '#4f6cf7',
    richText: '',
    file: null,
    otp: '',
    rating: 0,
    phone: '',
    currency: '',
    timeRange: { start: '', end: '' },
    toggleSingle: null,
    toggleMulti: [],
  });

  const update = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-8">
      {/* Text Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Texto</CardTitle>
          <CardDescription>
            Inputs de texto simples, com ícone, email, URL, senha e pesquisa
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Nome completo"
            placeholder="João Silva"
            icon={User}
            value={form.name}
            onChange={update('name')}
            required
          />
          <TextInput
            label="Email"
            placeholder="joao@email.com"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={update('email')}
          />
          <TextInput
            label="Telefone"
            placeholder="+55 (11) 99999-0000"
            icon={Phone}
            value={form.phone}
            onChange={update('phone')}
          />
          <TextInput
            label="Website"
            placeholder="https://exemplo.com"
            icon={Globe}
            value={form.url}
            onChange={update('url')}
          />
          <PasswordInput
            label="Senha"
            value={form.password}
            onChange={update('password')}
            required
          />
          <SearchInput
            value={form.search}
            onChange={update('search')}
            placeholder="Pesquisar componentes..."
          />
          <TextInput
            label="Com erro"
            placeholder="Campo com erro"
            value=""
            onChange={() => {}}
            error="Este campo é obrigatório"
          />
          <TextInput
            label="Desabilitado"
            placeholder="Não editável"
            value="Valor fixo"
            onChange={() => {}}
            disabled
          />
        </CardContent>
      </Card>

      {/* Number Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Números</CardTitle>
          <CardDescription>Inputs numéricos com prefixo, sufixo, stepper e slider</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Valor"
            value={form.amount}
            onChange={update('amount')}
            prefix="R$"
            placeholder="0,00"
          />
          <NumberInput
            label="Quantidade"
            value={form.quantity}
            onChange={update('quantity')}
            showStepper
            min={0}
            max={100}
          />
          <NumberInput label="Peso" value="" onChange={() => {}} suffix="kg" placeholder="0" />
          <NumberInput
            label="Temperatura"
            value=""
            onChange={() => {}}
            suffix="°C"
            step={0.5}
            placeholder="0.0"
          />
          <div className="md:col-span-2">
            <SliderInput
              label="Progresso"
              value={form.percentage}
              onChange={update('percentage')}
              suffix="%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data e Hora</CardTitle>
          <CardDescription>Calendário, datetime e time picker</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DateInput label="Data" value={form.date} onChange={update('date')} required />
          <DateTimeInput label="Data e Hora" value={form.datetime} onChange={update('datetime')} />
          <DateTimeInput label="Hora" value={form.time} onChange={update('time')} type="time" />
        </CardContent>
      </Card>

      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seleção</CardTitle>
          <CardDescription>Select, multi-select, radio, checkbox e switch</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Categoria"
            value={form.category}
            onChange={update('category')}
            options={[
              { value: 'tech', label: 'Tecnologia' },
              { value: 'design', label: 'Design' },
              { value: 'business', label: 'Negócios' },
              { value: 'marketing', label: 'Marketing' },
            ]}
            required
          />
          <MultiSelectInput
            label="Habilidades"
            value={form.multiSelect}
            onChange={update('multiSelect')}
            options={[
              { value: 'react', label: 'React' },
              { value: 'node', label: 'Node.js' },
              { value: 'python', label: 'Python' },
              { value: 'figma', label: 'Figma' },
              { value: 'sql', label: 'SQL' },
            ]}
          />
          <RadioGroupInput
            label="Plano"
            value={form.radio}
            onChange={update('radio')}
            options={[
              { value: 'option1', label: 'Básico', description: 'Gratuito para sempre' },
              { value: 'option2', label: 'Pro', description: 'R$ 29/mês' },
              { value: 'option3', label: 'Enterprise', description: 'Contato comercial' },
            ]}
          />
          <div className="space-y-4">
            <CheckboxInput
              label="Aceito os termos de uso"
              description="Ao marcar, você concorda com nossos termos."
              checked={form.checkbox}
              onChange={update('checkbox')}
            />
            <SwitchInput
              label="Notificações por email"
              description="Receber atualizações sobre novos recursos."
              checked={form.switch}
              onChange={update('switch')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags & Color */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tags e Cor</CardTitle>
          <CardDescription>Input de tags e seletor de cores</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TagsInput
            label="Tags"
            value={form.tags}
            onChange={update('tags')}
            description="Pressione Enter para adicionar"
          />
          <ColorInput label="Cor do tema" value={form.color} onChange={update('color')} />
        </CardContent>
      </Card>

      {/* Rich Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Texto Rico e Área de Texto</CardTitle>
          <CardDescription>
            Editor rich text (Quill) e textarea com limite de caracteres
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextAreaInput
            label="Descrição"
            value={form.description}
            onChange={update('description')}
            placeholder="Escrever uma descrição..."
            maxLength={500}
          />
          <RichTextInput label="Conteúdo" value={form.richText} onChange={update('richText')} />
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload de Arquivos</CardTitle>
          <CardDescription>Drag & drop para upload de arquivos</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadInput
            label="Documento"
            value={form.file}
            onChange={update('file')}
            accept=".pdf,.doc,.docx,.png,.jpg"
            description="PDF, DOC, DOCX, PNG ou JPG até 10MB"
          />
        </CardContent>
      </Card>

      {/* OTP & Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">OTP & Avaliação</CardTitle>
          <CardDescription>Código de verificação por dígitos e seletor de estrelas</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OTPInput
            label="Código de verificação"
            value={form.otp}
            onChange={update('otp')}
            length={6}
            required
          />
          <OTPInput label="PIN (4 dígitos)" value={form.otp} onChange={update('otp')} length={4} />
          <RatingInput label="Avaliação" value={form.rating} onChange={update('rating')} required />
          <RatingInput
            label="Avaliação (10 estrelas)"
            value={form.rating}
            onChange={update('rating')}
            max={10}
          />
        </CardContent>
      </Card>

      {/* Phone & Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Telefone & Moeda</CardTitle>
          <CardDescription>Inputs especializados com seletor de prefixo/moeda</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhoneInput
            label="Número de telefone"
            value={form.phone}
            onChange={update('phone')}
            required
          />
          <PhoneInput
            label="Telemóvel (desabilitado)"
            value="+351 912 345 678"
            onChange={() => {}}
            disabled
          />
          <CurrencyInput
            label="Valor"
            value={form.currency}
            onChange={update('currency')}
            currency="EUR"
          />
          <CurrencyInput
            label="Preço em reais"
            value={form.currency}
            onChange={update('currency')}
            currency="BRL"
          />
        </CardContent>
      </Card>

      {/* Time Range & Toggle Group */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Intervalo de Tempo & Toggle Group</CardTitle>
          <CardDescription>Seletor de período e grupo de botões de seleção</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimeRangeInput
            label="Horário de funcionamento"
            value={form.timeRange}
            onChange={update('timeRange')}
            required
          />
          <TimeRangeInput
            label="Intervalo (desabilitado)"
            value={{ start: '09:00', end: '18:00' }}
            onChange={() => {}}
            disabled
          />
          <ToggleGroupInput
            label="Alinhamento (seleção única)"
            value={form.toggleSingle}
            onChange={update('toggleSingle')}
            options={[
              { value: 'left', label: 'Esquerda', icon: AlignLeft },
              { value: 'center', label: 'Centro', icon: AlignCenter },
              { value: 'right', label: 'Direita', icon: AlignRight },
            ]}
          />
          <ToggleGroupInput
            label="Formatação (seleção múltipla)"
            value={form.toggleMulti}
            onChange={update('toggleMulti')}
            multiple
            options={[
              { value: 'bold', label: 'Negrito', icon: Bold },
              { value: 'italic', label: 'Itálico', icon: Italic },
              { value: 'underline', label: 'Sublinhado', icon: Underline },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
