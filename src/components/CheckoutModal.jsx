import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, QrCode, CreditCard, Truck, ShieldCheck, ArrowRight, ExternalLink, MessageCircle } from 'lucide-react';

export function CheckoutModal({ isOpen, onClose, items, total, shippingValue, shippingMethod, storeConfig, onOrderCompleted, theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [step, setStep] = useState('shipping'); // 'shipping' | 'payment' | 'success'
  const [copiedPix, setCopiedPix] = useState(false);

  // Formulário do Cliente
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'card'
  const [orderNumber, setOrderNumber] = useState('');

  const finalTotal = total + (shippingValue || 0);

  // Simulação de chave PIX Copia e Cola
  const fakePixCode = `00020126580014br.gov.bcb.pix0136${storeConfig?.pixKey || 'pix@levant.com.br'}520400005303986540${finalTotal.toFixed(2)}5802BR5920${storeConfig?.pixBeneficiary || 'LEVANT STORE'}6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(fakePixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleFinishOrder = () => {
    const randomOrderNum = `LVNT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrderNum);
    setStep('success');
    if (onOrderCompleted) {
      onOrderCompleted(randomOrderNum);
    }
  };

  // Se a Nuvemshop estiver ativa e configurada para redirecionamento
  const handleRedirectNuvemshop = () => {
    const nuvemUrl = storeConfig?.nuvemshop?.storeUrl;
    if (nuvemUrl) {
      const cleanUrl = nuvemUrl.startsWith('http')
        ? nuvemUrl.replace(/\/$/, '')
        : `https://${nuvemUrl.replace(/\/$/, '')}`;

      const cartItemsParam = items
        .map((i) => {
          const variantId = i.variants?.[0]?.id || i.nuvemshopId || i.id;
          return `${variantId}:${i.quantity || 1}`;
        })
        .join(',');

      const fullCartUrl = cartItemsParam ? `${cleanUrl}/cart/add/${cartItemsParam}` : cleanUrl;
      window.open(fullCartUrl, '_blank');
    }
  };

  // Enviar resumo do pedido para o WhatsApp da Loja
  const handleWhatsAppConfirmation = () => {
    const phone = storeConfig?.whatsappNumber?.replace(/\D/g, '') || '5511999999999';
    const itemsSummary = items
      .map((i) => `• ${i.name} (Tam: ${i.selectedSize}, Cor: ${i.selectedColor}) - Qtd: ${i.quantity || 1}`)
      .join('\n');

    const msg = `Olá Levant! Acabei de fazer o pedido *${orderNumber}* no site.\n\n*Cliente:* ${formData.name}\n*Endereço:* ${formData.street}, ${formData.number} - ${formData.city}/${formData.state}\n\n*Peças:*\n${itemsSummary}\n\n*Total com Frete:* R$ ${finalTotal.toFixed(2).replace('.', ',')}\n\nGostaria de confirmar o envio!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal de Checkout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden my-auto z-10 transition-colors"
          style={{
            backgroundColor: isDark ? '#23252a' : '#ffffff',
            borderColor: isDark ? '#363942' : '#e4e4e7',
            color: isDark ? '#f4f5f7' : '#18181b',
          }}
        >
          {/* Header */}
          <div
            className="p-5 sm:p-6 border-b flex items-center justify-between"
            style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-orange-500 block mb-0.5">
                Checkout Seguro · Levant
              </span>
              <h2 className="text-xl font-bold tracking-tight font-sans uppercase">
                {step === 'shipping' && '1. Endereço & Identificação'}
                {step === 'payment' && '2. Escolha o Pagamento'}
                {step === 'success' && '3. Pedido Concluído!'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:opacity-75 transition-colors cursor-pointer"
              style={{
                backgroundColor: isDark ? '#2f3239' : '#f4f4f5',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo Dinâmico */}
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
            {/* ETAPA 1: ENDEREÇO & IDENTIFICAÇÃO */}
            {step === 'shipping' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos Eduardo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                      style={{
                        backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                        borderColor: isDark ? '#363942' : '#d4d4d8',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                      WhatsApp / Celular *
                    </label>
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                      style={{
                        backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                        borderColor: isDark ? '#363942' : '#d4d4d8',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                      style={{
                        backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                        borderColor: isDark ? '#363942' : '#d4d4d8',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                      CPF (para emissão de envio) *
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                      style={{
                        backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                        borderColor: isDark ? '#363942' : '#d4d4d8',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </div>
                </div>

                {/* Linha de Endereço */}
                <div className="border-t pt-3 mt-4" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-orange-500 block mb-2">
                    Endereço de Entrega
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        CEP
                      </label>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        Rua / Avenida
                      </label>
                      <input
                        type="text"
                        placeholder="Rua Oscar Freire"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        Número
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        Complemento
                      </label>
                      <input
                        type="text"
                        placeholder="Apto 42"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        Cidade
                      </label>
                      <input
                        type="text"
                        placeholder="São Paulo"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        UF
                      </label>
                      <input
                        type="text"
                        placeholder="SP"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none focus:border-orange-500"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Opção se Nuvemshop estiver ativa */}
                {storeConfig?.nuvemshop?.storeUrl && (
                  <div
                    className="p-3.5 rounded-xl border flex items-center justify-between mt-3"
                    style={{
                      backgroundColor: isDark ? '#1e2025' : '#f4f3ed',
                      borderColor: '#f97316',
                    }}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-orange-500 block">
                        Conectado à Nuvemshop
                      </span>
                      <p className="text-xs font-sans opacity-80">
                        Você também pode concluir via checkout da Nuvemshop.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRedirectNuvemshop}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase bg-orange-600 text-white flex items-center gap-1.5 hover:bg-orange-500 transition-colors"
                    >
                      <span>Ir pra Nuvemshop</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Botão Avançar */}
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.name || !formData.phone) {
                      alert('Por favor, preencha ao menos seu Nome e WhatsApp para prosseguir.');
                      return;
                    }
                    setStep('payment');
                  }}
                  className="w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-6"
                  style={{
                    backgroundColor: isDark ? '#f4f5f7' : '#18181b',
                    color: isDark ? '#18181b' : '#ffffff',
                  }}
                >
                  <span>Continuar para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ETAPA 2: FORMAS DE PAGAMENTO */}
            {step === 'payment' && (
              <div className="space-y-5">
                {/* Opção Nuvemshop Oficial quando configurada */}
                {storeConfig?.nuvemshop?.storeUrl && (
                  <div
                    className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    style={{
                      backgroundColor: isDark ? '#161f30' : '#eff6ff',
                      borderColor: '#3b82f6',
                    }}
                  >
                    <div>
                      <span className="text-xs font-bold font-sans flex items-center gap-1.5 text-blue-400">
                        <ExternalLink className="w-3.5 h-3.5" /> Pagar via Nuvem Pago & Nuvem Envio
                      </span>
                      <span className="text-[11px] font-mono opacity-70 block mt-0.5">
                        Finalize com cálculo automático de frete e emissão da etiqueta de envio.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRedirectNuvemshop}
                      className="py-2 px-3.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Abrir na Nuvemshop</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className="p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                    style={{
                      backgroundColor: paymentMethod === 'pix' ? (isDark ? '#2e3137' : '#f2f1ec') : 'transparent',
                      borderColor: paymentMethod === 'pix' ? '#f97316' : (isDark ? '#363942' : '#e4e4e7'),
                    }}
                  >
                    <QrCode className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-mono font-bold uppercase">PIX Instantâneo</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Aprovação Imediata
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className="p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                    style={{
                      backgroundColor: paymentMethod === 'card' ? (isDark ? '#2e3137' : '#f2f1ec') : 'transparent',
                      borderColor: paymentMethod === 'card' ? '#f97316' : (isDark ? '#363942' : '#e4e4e7'),
                    }}
                  >
                    <CreditCard className="w-6 h-6 text-orange-500" />
                    <span className="text-xs font-mono font-bold uppercase">Cartão de Crédito</span>
                    <span className="text-[10px] font-mono opacity-70">Até 6x sem juros</span>
                  </button>
                </div>

                {/* Detalhe do PIX */}
                {paymentMethod === 'pix' && (
                  <div
                    className="p-4 rounded-xl border space-y-3"
                    style={{
                      backgroundColor: isDark ? '#1e2025' : '#faf9f5',
                      borderColor: isDark ? '#363942' : '#e4e4e7',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase">Total a pagar via PIX:</span>
                      <span className="text-base font-mono font-black text-emerald-500">
                        R$ {finalTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <p className="text-xs font-sans opacity-80 leading-relaxed">
                      Ao clicar em "Gerar Pedido e Pagar", você receberá o código Copia e Cola e o QR Code oficial para pagamento direto no app do seu banco.
                    </p>
                  </div>
                )}

                {/* Detalhe do Cartão */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none"
                        style={{
                          backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                          borderColor: isDark ? '#363942' : '#d4d4d8',
                          color: isDark ? '#ffffff' : '#000000',
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none"
                          style={{
                            backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                            borderColor: isDark ? '#363942' : '#d4d4d8',
                            color: isDark ? '#ffffff' : '#000000',
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 rounded-lg text-xs font-sans border outline-none"
                          style={{
                            backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                            borderColor: isDark ? '#363942' : '#d4d4d8',
                            color: isDark ? '#ffffff' : '#000000',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border hover:opacity-80 transition-colors"
                    style={{ borderColor: isDark ? '#363942' : '#d4d4d8' }}
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishOrder}
                    className="flex-1 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmar e Gerar Pedido</span>
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3: PEDIDO GERADO COM SUCESSO! */}
            {step === 'success' && (
              <div className="text-center py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-1">
                    Pedido Registrado com Sucesso!
                  </span>
                  <h3 className="text-2xl font-black uppercase font-sans">
                    N° {orderNumber}
                  </h3>
                  <p className="text-xs font-sans opacity-70 mt-1 max-w-md mx-auto">
                    Obrigado, <strong className="text-white">{formData.name}</strong>! Seu pedido foi reservado.
                  </p>
                </div>

                {/* Box de Pagamento PIX */}
                {paymentMethod === 'pix' && (
                  <div
                    className="p-5 rounded-2xl border max-w-md mx-auto text-left space-y-3"
                    style={{
                      backgroundColor: isDark ? '#1e2025' : '#f4f3ed',
                      borderColor: '#059669',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-emerald-500 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4" /> Pague com PIX Copia e Cola
                      </span>
                      <span className="text-sm font-mono font-bold">
                        R$ {finalTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div
                      className="p-2.5 rounded-lg border text-[10px] font-mono break-all line-clamp-2 select-all"
                      style={{
                        backgroundColor: isDark ? '#151619' : '#ffffff',
                        borderColor: isDark ? '#2d3037' : '#e4e4e7',
                      }}
                    >
                      {fakePixCode}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full py-2.5 rounded-lg text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-4 h-4" /> Código PIX Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copiar Código PIX
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Botão de WhatsApp */}
                <div className="pt-2 max-w-md mx-auto space-y-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppConfirmation}
                    className="w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar Envio pelo WhatsApp VIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                  >
                    Voltar para a Loja
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

