import { NextRequest, NextResponse } from 'next/server';

// Webhook do Mercado Pago para receber notificações de pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mercado Pago envia notificações de diferentes tipos
    // Tipo "payment" é o que nos interessa
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Aqui você faria uma chamada à API do Mercado Pago para verificar o status
      // Por enquanto, vamos simular a verificação
      console.log('Payment ID recebido:', paymentId);
      
      // TODO: Implementar verificação real com API do Mercado Pago
      // const paymentInfo = await verificarPagamento(paymentId);
      
      // Se pagamento aprovado, atualizar status do usuário no banco de dados
      // await atualizarAssinatura(userId, planId, paymentInfo);
      
      return NextResponse.json({ received: true }, { status: 200 });
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 });
  }
}

// Endpoint para verificar status de pagamento manualmente
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  
  if (status === 'approved' && paymentId) {
    // Redirecionar para página de sucesso com informações do pagamento
    return NextResponse.redirect(new URL(`/payment/success?payment_id=${paymentId}`, request.url));
  }
  
  return NextResponse.json({ status: 'pending' });
}
