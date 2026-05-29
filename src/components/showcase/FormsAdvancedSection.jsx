import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AddressInput from '../forms/AddressInput';
import MaskedInput from '../forms/MaskedInput';
import SignaturePad from '../forms/SignaturePad';
import ImageCropInput from '../forms/ImageCropInput';

export default function FormsAdvancedSection() {
  const [address, setAddress] = useState({});
  const [masks, setMasks] = useState({ nif: '', iban: '', date: '', phone: '', cc: '' });
  const [sig, setSig] = useState('');
  const [img, setImg] = useState('');

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AddressInput</CardTitle>
          <CardDescription>
            Input composto para morada com rua, cidade, código postal e país
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddressInput
            label="Morada de faturação"
            value={address}
            onChange={setAddress}
            required
          />
          <AddressInput
            label="Morada (desabilitado)"
            value={{
              street: 'Av. da Liberdade 100',
              city: 'Lisboa',
              postal: '1250-096',
              country: 'PT',
            }}
            onChange={() => {}}
            disabled
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">MaskedInput</CardTitle>
          <CardDescription>
            Input com máscara para NIF, IBAN, datas, telefone e cartão de crédito
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MaskedInput
            label="NIF"
            mask="nif"
            value={masks.nif}
            onChange={(v) => setMasks((m) => ({ ...m, nif: v }))}
            required
          />
          <MaskedInput
            label="Telemóvel"
            mask="phone"
            value={masks.phone}
            onChange={(v) => setMasks((m) => ({ ...m, phone: v }))}
          />
          <MaskedInput
            label="Data de nascimento"
            mask="date"
            value={masks.date}
            onChange={(v) => setMasks((m) => ({ ...m, date: v }))}
          />
          <MaskedInput
            label="IBAN"
            mask="iban"
            value={masks.iban}
            onChange={(v) => setMasks((m) => ({ ...m, iban: v }))}
          />
          <MaskedInput
            label="Cartão de crédito"
            mask="cc"
            value={masks.cc}
            onChange={(v) => setMasks((m) => ({ ...m, cc: v }))}
          />
          <MaskedInput
            label="Com erro"
            mask="nif"
            value=""
            onChange={() => {}}
            error="NIF inválido"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SignaturePad</CardTitle>
          <CardDescription>Campo de assinatura digital por rato ou toque</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignaturePad label="Assinatura" value={sig} onChange={setSig} required />
          <SignaturePad label="Assinatura (desabilitado)" value="" onChange={() => {}} disabled />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ImageCropInput</CardTitle>
          <CardDescription>Upload de imagem com pré-visualização, zoom e recorte</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageCropInput label="Foto de perfil" value={img} onChange={setImg} aspectRatio={1} />
          <ImageCropInput label="Capa (16:9)" value={img} onChange={setImg} aspectRatio={16 / 9} />
        </CardContent>
      </Card>
    </div>
  );
}
