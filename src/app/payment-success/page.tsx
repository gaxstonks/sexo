"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowRight, Sparkles } from "lucide-react";
import { activateSubscription, getSubscription } from "@/lib/subscription";
import { toast } from "sonner";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Obter parâmetros da URL
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const plan = searchParams.get("plan") as 'daily' | 'monthly' | 'annual' | null;

    // Verificar se o pagamento foi aprovado
    if (status === "approved" && plan && paymentId) {
      // Ativar assinatura
      activateSubscription(plan, paymentId);
      
      // Obter dados da assinatura
      const sub = getSubscription();
      setSubscription(sub);
      
      setIsProcessing(false);

      // Exibir notificação de sucesso
      toast.success("🎉 Pagamento confirmado com sucesso!", {
        description: "Seus downloads em PDF foram liberados. Aproveite!",
        duration: 5000,
      });
    } else {
      // Se não houver parâmetros válidos, redirecionar para home
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [searchParams, router]);

  const handleDownloadPDF = () => {
    // Aqui você implementaria a geração real do PDF
    toast.success("✅ Download iniciado!", {
      description: "Seu currículo em PDF está sendo gerado...",
    });
  };

  const handleCreateResume = () => {
    router.push("/#resume-builder-section");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center">
        <Card className="p-12 max-w-md text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Processando pagamento...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aguarde enquanto confirmamos sua assinatura
          </p>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center">
        <Card className="p-12 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Erro no pagamento</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Não foi possível processar seu pagamento. Você será redirecionado...
          </p>
        </Card>
      </div>
    );
  }

  const planNames = {
    daily: "Diário",
    monthly: "Mensal",
    annual: "Anual"
  };

  const planPrices = {
    daily: "R$ 7,90",
    monthly: "R$ 19,90",
    annual: "R$ 89,90"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Pagamento Confirmado! 🎉
            </h1>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
              Sua assinatura está ativa e pronta para uso
            </p>
            
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Agora você pode criar e baixar currículos profissionais ilimitados
            </p>
          </div>

          {/* Subscription Details */}
          <Card className="p-8 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Plano {planNames[subscription.plan]}</h2>
                <p className="text-3xl font-bold text-green-600">{planPrices[subscription.plan]}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID do Pagamento</p>
                <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                  {subscription.paymentId.substring(0, 20)}...
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data de Ativação</p>
                <p className="font-semibold">
                  {new Date(subscription.activatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Válido Até</p>
                <p className="font-semibold">
                  {new Date(subscription.expiresAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Benefícios Inclusos:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Download ilimitado de currículos em PDF</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Acesso a todos os modelos profissionais</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Edição e atualização ilimitadas</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Suporte {subscription.plan === 'annual' ? 'VIP' : subscription.plan === 'monthly' ? 'prioritário' : 'básico'}</span>
                </li>
                {subscription.plan === 'annual' && (
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Modelos exclusivos para assinantes anuais</span>
                  </li>
                )}
              </ul>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button
              size="lg"
              onClick={handleCreateResume}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold shadow-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Criar Meu Currículo
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadPDF}
              className="py-6 text-lg font-semibold border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar em PDF
            </Button>
          </div>

          {/* Info Box */}
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Dica Profissional</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Agora que você tem acesso completo, crie múltiplas versões do seu currículo 
                  personalizadas para diferentes vagas. Isso aumenta suas chances de ser chamado 
                  para entrevistas!
                </p>
              </div>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Voltar para a página inicial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center">
        <Card className="p-12 max-w-md text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Carregando...</h2>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
