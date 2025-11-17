"use client";

import { 
  FileText, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  Layout,
  Edit3,
  Lightbulb,
  Code,
  Palette as PaletteIcon,
  DollarSign,
  Users,
  BarChart,
  TrendingUp,
  Target,
  Download,
  Eye,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { hasActiveSubscription, getSubscriptionMessage } from "@/lib/subscription";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  professionalTitle: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

type TemplateType = 'default' | 'tecnologia' | 'design' | 'marketing' | 'vendas' | 'financeiro' | 'recursos-humanos';

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('default');
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      professionalTitle: "",
      summary: ""
    },
    experiences: [],
    education: [],
    skills: []
  });

  useEffect(() => {
    // Verificar se usuário tem assinatura ativa
    setHasSubscription(hasActiveSubscription());

    // Verificar se veio de um pagamento bem-sucedido
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');
    const plan = urlParams.get('plan');

    if (paymentStatus === 'approved' && paymentId && plan) {
      // Redirecionar para página de sucesso
      window.location.href = `/payment-success?payment_id=${paymentId}&status=${paymentStatus}&plan=${plan}`;
      return;
    }

    // Função auxiliar para injetar script com segurança e tratamento de erros robusto
    const injectMercadoPagoScript = (buttonId: string, preferenceId: string) => {
      try {
        const button = document.getElementById(buttonId);
        if (!button) return null;

        // Verificar se já existe um script neste botão
        const existingScript = button.querySelector('script[data-preference-id]');
        if (existingScript) return existingScript;

        // Criar novo script
        const script = document.createElement('script');
        script.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
        script.setAttribute('data-preference-id', preferenceId);
        script.setAttribute('data-source', 'button');
        script.setAttribute('data-button-label', 'Começar Agora');
        
        // Adicionar handlers de erro silenciosos
        script.onerror = (e) => {
          // Silenciar erros do Mercado Pago para evitar poluição do console
        };

        button.appendChild(script);
        return script;
      } catch (error) {
        // Silenciar erros de injeção de script
        return null;
      }
    };

    // Injetar scripts para cada botão com tratamento de erro
    const scriptDaily = injectMercadoPagoScript(
      'daily-payment-button',
      '245781992-28fd724e-300a-4c97-8800-d8c70d63b814'
    );

    const scriptMonthly = injectMercadoPagoScript(
      'monthly-payment-button',
      '245781992-f2eb9b89-6593-434e-befb-4263e4e2c8ec'
    );

    const scriptAnnual = injectMercadoPagoScript(
      'annual-payment-button',
      '245781992-216c8c46-842e-4b01-93d1-214f5c91deb4'
    );

    // Cleanup seguro com verificações adicionais
    return () => {
      const safeRemoveScript = (script: HTMLScriptElement | null) => {
        try {
          if (script && script.parentNode && document.body.contains(script)) {
            script.parentNode.removeChild(script);
          }
        } catch (error) {
          // Silenciar erros de remoção
        }
      };

      safeRemoveScript(scriptDaily);
      safeRemoveScript(scriptMonthly);
      safeRemoveScript(scriptAnnual);
    };
  }, []);

  // Função para rolar até a seção de templates
  const handleViewTemplates = () => {
    const templatesSection = document.getElementById('templates-section');
    templatesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para rolar até a seção de preços
  const handleViewPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para rolar até a seção de features
  const handleViewFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para criar currículo (mostra o formulário)
  const handleCreateResume = (template: TemplateType = 'default') => {
    setSelectedTemplate(template);
    setShowResumeBuilder(true);
    setTimeout(() => {
      const builderSection = document.getElementById('resume-builder-section');
      builderSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Função para visualizar seção específica de template por área
  const handleViewTemplateSection = (area: string) => {
    const areaId = `template-preview-${area.toLowerCase().replace(/\s+/g, '-')}`;
    const areaSection = document.getElementById(areaId);
    if (areaSection) {
      areaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Funções para gerenciar experiências
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setResumeData({
      ...resumeData,
      experiences: [...resumeData.experiences, newExperience]
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  // Funções para gerenciar educação
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  // Funções para gerenciar habilidades
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermediário"
    };
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill]
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  // Verificar se o formulário está completo
  const isFormComplete = () => {
    const { personalInfo, experiences, education, skills } = resumeData;
    return (
      personalInfo.fullName.trim() !== "" &&
      personalInfo.email.trim() !== "" &&
      personalInfo.phone.trim() !== "" &&
      personalInfo.professionalTitle.trim() !== "" &&
      experiences.length > 0 &&
      education.length > 0 &&
      skills.length > 0
    );
  };

  // Função para visualizar o currículo
  const handlePreview = () => {
    setShowPreview(true);
    setTimeout(() => {
      const previewSection = document.getElementById('resume-preview-section');
      previewSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Função para baixar PDF (verifica assinatura)
  const handleDownloadPDF = () => {
    // Verificar se tem assinatura ativa
    if (hasActiveSubscription()) {
      // Simular download do PDF
      alert('✅ Download iniciado! Seu currículo em PDF está sendo gerado...');
      // Aqui você implementaria a geração real do PDF
    } else {
      // Redirecionar para página de preços
      alert('⚠️ Você precisa de uma assinatura ativa para baixar em PDF. Escolha um plano abaixo!');
      const pricingSection = document.getElementById('pricing-section');
      pricingSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para obter cores do template
  const getTemplateColors = () => {
    switch (selectedTemplate) {
      case 'tecnologia':
        return {
          primary: 'from-blue-600 to-cyan-600',
          secondary: 'bg-blue-100 dark:bg-blue-900',
          accent: 'text-blue-600',
          border: 'border-blue-500'
        };
      case 'design':
        return {
          primary: 'from-purple-600 to-pink-600',
          secondary: 'bg-purple-100 dark:bg-purple-900',
          accent: 'text-purple-600',
          border: 'border-purple-500'
        };
      case 'marketing':
        return {
          primary: 'from-pink-600 to-orange-600',
          secondary: 'bg-pink-100 dark:bg-pink-900',
          accent: 'text-pink-600',
          border: 'border-pink-500'
        };
      case 'vendas':
        return {
          primary: 'from-green-600 to-emerald-600',
          secondary: 'bg-green-100 dark:bg-green-900',
          accent: 'text-green-600',
          border: 'border-green-500'
        };
      case 'financeiro':
        return {
          primary: 'from-orange-600 to-red-600',
          secondary: 'bg-orange-100 dark:bg-orange-900',
          accent: 'text-orange-600',
          border: 'border-orange-500'
        };
      case 'recursos-humanos':
        return {
          primary: 'from-indigo-600 to-purple-600',
          secondary: 'bg-indigo-100 dark:bg-indigo-900',
          accent: 'text-indigo-600',
          border: 'border-indigo-500'
        };
      default:
        return {
          primary: 'from-blue-600 to-purple-600',
          secondary: 'bg-blue-100 dark:bg-blue-900',
          accent: 'text-blue-600',
          border: 'border-blue-500'
        };
    }
  };

  const templateColors = getTemplateColors();

  // Função para renderizar preview baseado no template
  const renderTemplatePreview = () => {
    const colors = getTemplateColors();
    
    return (
      <div className={`border-2 ${colors.border} rounded-lg p-6 min-h-[600px] bg-white dark:bg-gray-900`}>
        {/* Header do Currículo */}
        <div className={`border-b-2 ${colors.border} pb-4 mb-4`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {resumeData.personalInfo.fullName || "Seu Nome"}
          </h2>
          <p className={`${colors.accent} font-semibold`}>
            {resumeData.personalInfo.professionalTitle || "Título Profissional"}
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
            {resumeData.personalInfo.email && (
              <p className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {resumeData.personalInfo.email}
              </p>
            )}
            {resumeData.personalInfo.phone && (
              <p className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {resumeData.personalInfo.phone}
              </p>
            )}
            {resumeData.personalInfo.location && (
              <p className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {resumeData.personalInfo.location}
              </p>
            )}
          </div>
        </div>

        {/* Resumo */}
        {resumeData.personalInfo.summary && (
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${colors.accent} mb-2`}>RESUMO</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {resumeData.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experiência */}
        {resumeData.experiences.length > 0 && (
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${colors.accent} mb-2 flex items-center gap-2`}>
              <Briefcase className="w-4 h-4" />
              EXPERIÊNCIA
            </h3>
            <div className="space-y-3">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <p className="font-semibold text-gray-900 dark:text-white">{exp.company || "Empresa"}</p>
                  <p className="text-gray-700 dark:text-gray-300">{exp.position || "Cargo"}</p>
                  <p className="text-gray-500 text-[10px]">
                    {exp.startDate || "Início"} - {exp.current ? "Presente" : exp.endDate || "Fim"}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educação */}
        {resumeData.education.length > 0 && (
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${colors.accent} mb-2 flex items-center gap-2`}>
              <GraduationCap className="w-4 h-4" />
              EDUCAÇÃO
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <p className="font-semibold text-gray-900 dark:text-white">{edu.institution || "Instituição"}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {edu.degree || "Grau"} em {edu.field || "Área"}
                  </p>
                  <p className="text-gray-500 text-[10px]">
                    {edu.startDate || "Início"} - {edu.current ? "Cursando" : edu.endDate || "Fim"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades */}
        {resumeData.skills.length > 0 && (
          <div>
            <h3 className={`text-sm font-bold ${colors.accent} mb-2 flex items-center gap-2`}>
              <Award className="w-4 h-4" />
              HABILIDADES
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-3 py-1 ${colors.secondary} ${colors.accent} rounded-full text-[10px] font-medium`}
                >
                  {skill.name || "Habilidade"} - {skill.level}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Banner de Status de Assinatura */}
      {hasSubscription && (
        <div className="bg-green-600 text-white py-3 text-center relative z-20">
          <p className="text-sm font-medium">
            ✅ {getSubscriptionMessage()}
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div id="hero-section" className="text-center max-w-5xl mx-auto mb-16">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <FileText className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              CurrículoPlus
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
              Transforme sua carreira com currículos profissionais
            </p>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Crie currículos impressionantes em minutos com nossos modelos personalizáveis, 
              editor intuitivo e dicas inteligentes que destacam suas qualificações
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg"
              onClick={() => handleCreateResume('default')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Criar Meu Currículo Grátis
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={handleViewTemplates}
              className="px-10 py-7 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Layout className="w-5 h-5 mr-2" />
              Ver Modelos
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleViewPricing}>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Teste Gratuito</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleViewFeatures}>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Dicas Profissionais</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleViewFeatures}>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Download em PDF</span>
            </div>
            <div className="flex items-center gap-2 hover:text-yellow-600 transition-colors duration-200 cursor-pointer" onClick={handleViewTemplates}>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>Modelos Profissionais</span>
            </div>
          </div>
        </div>

        {/* Resume Builder Section */}
        {showResumeBuilder && (
          <div id="resume-builder-section" className="max-w-7xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Monte Seu Currículo Profissional</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Preencha os campos abaixo e veja seu currículo ganhar vida em tempo real
              </p>
              {selectedTemplate !== 'default' && (
                <div className={`inline-flex items-center gap-2 mt-4 px-6 py-3 ${templateColors.secondary} ${templateColors.accent} rounded-full font-semibold`}>
                  <Layout className="w-5 h-5" />
                  Modelo: {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1).replace('-', ' ')}
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulário */}
              <div className="space-y-8">
                {/* Informações Pessoais */}
                <Card className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${templateColors.border}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 ${templateColors.secondary} rounded-lg flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${templateColors.accent}`} />
                    </div>
                    <h3 className="text-xl font-bold">Informações Pessoais</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Nome Completo *</Label>
                        <Input
                          id="fullName"
                          placeholder="João Silva"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">💡 Use seu nome completo como aparece em documentos</p>
                      </div>

                      <div>
                        <Label htmlFor="professionalTitle">Título Profissional *</Label>
                        <Input
                          id="professionalTitle"
                          placeholder="Desenvolvedor Full Stack"
                          value={resumeData.personalInfo.professionalTitle}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, professionalTitle: e.target.value }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">💡 Ex: Designer UX/UI, Analista de Marketing, Gerente de Vendas</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="joao@email.com"
                            className="pl-10"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                            })}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">💡 Use um email profissional</p>
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            placeholder="(11) 99999-9999"
                            className="pl-10"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                            })}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">💡 Inclua DDD</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Localização</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="location"
                            placeholder="São Paulo, SP"
                            className="pl-10"
                            value={resumeData.personalInfo.location}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                            })}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">💡 Cidade e estado</p>
                      </div>

                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="linkedin"
                            placeholder="linkedin.com/in/joaosilva"
                            className="pl-10"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                            })}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">💡 Seu perfil do LinkedIn</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="portfolio">Portfólio / Site</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="portfolio"
                          placeholder="www.meuportfolio.com"
                          className="pl-10"
                          value={resumeData.personalInfo.portfolio}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value }
                          })}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">💡 GitHub, Behance, ou seu site pessoal</p>
                    </div>

                    <div>
                      <Label htmlFor="summary">Resumo Profissional</Label>
                      <Textarea
                        id="summary"
                        placeholder="Descreva brevemente sua experiência e objetivos..."
                        rows={4}
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                        })}
                      />
                      <p className="text-xs text-gray-500 mt-1">💡 2-3 frases destacando suas principais qualificações e objetivos de carreira</p>
                    </div>
                  </div>
                </Card>

                {/* Experiência Profissional */}
                <Card className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${templateColors.border}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${templateColors.secondary} rounded-lg flex items-center justify-center`}>
                        <Briefcase className={`w-5 h-5 ${templateColors.accent}`} />
                      </div>
                      <h3 className="text-xl font-bold">Experiência Profissional *</h3>
                    </div>
                    <Button onClick={addExperience} size="sm" className={`gap-2 bg-gradient-to-r ${templateColors.primary}`}>
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </div>

                  {resumeData.experiences.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Clique em "Adicionar" para incluir sua experiência</p>
                      <p className="text-xs mt-2">💡 Inclua empresa, cargo, período e principais responsabilidades</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {resumeData.experiences.map((exp) => (
                        <div key={exp.id} className={`p-4 border-2 ${templateColors.border} rounded-lg space-y-3`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Experiência</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <Label>Empresa</Label>
                              <Input
                                placeholder="Nome da empresa"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Cargo</Label>
                              <Input
                                placeholder="Seu cargo"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <Label>Data de Início</Label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Data de Término</Label>
                              <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                disabled={exp.current}
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="checkbox"
                                  id={`current-${exp.id}`}
                                  checked={exp.current}
                                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                  className="rounded"
                                />
                                <label htmlFor={`current-${exp.id}`} className="text-sm">Trabalho aqui atualmente</label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Descrição das Atividades</Label>
                            <Textarea
                              placeholder="Descreva suas principais responsabilidades e conquistas..."
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">💡 Use bullet points e destaque resultados quantificáveis</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Educação */}
                <Card className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${templateColors.border}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${templateColors.secondary} rounded-lg flex items-center justify-center`}>
                        <GraduationCap className={`w-5 h-5 ${templateColors.accent}`} />
                      </div>
                      <h3 className="text-xl font-bold">Educação *</h3>
                    </div>
                    <Button onClick={addEducation} size="sm" className={`gap-2 bg-gradient-to-r ${templateColors.primary}`}>
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </div>

                  {resumeData.education.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Clique em "Adicionar" para incluir sua formação</p>
                      <p className="text-xs mt-2">💡 Inclua graduação, pós-graduação, cursos técnicos</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className={`p-4 border-2 ${templateColors.border} rounded-lg space-y-3`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Formação</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div>
                            <Label>Instituição</Label>
                            <Input
                              placeholder="Nome da instituição"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <Label>Grau</Label>
                              <Input
                                placeholder="Ex: Bacharelado, Tecnólogo"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Área de Estudo</Label>
                              <Input
                                placeholder="Ex: Ciência da Computação"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <Label>Data de Início</Label>
                              <Input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Data de Conclusão</Label>
                              <Input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                disabled={edu.current}
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="checkbox"
                                  id={`current-edu-${edu.id}`}
                                  checked={edu.current}
                                  onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                  className="rounded"
                                />
                                <label htmlFor={`current-edu-${edu.id}`} className="text-sm">Cursando atualmente</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Habilidades */}
                <Card className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${templateColors.border}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${templateColors.secondary} rounded-lg flex items-center justify-center`}>
                        <Award className={`w-5 h-5 ${templateColors.accent}`} />
                      </div>
                      <h3 className="text-xl font-bold">Habilidades *</h3>
                    </div>
                    <Button onClick={addSkill} size="sm" className={`gap-2 bg-gradient-to-r ${templateColors.primary}`}>
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </div>

                  {resumeData.skills.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Clique em "Adicionar" para incluir suas habilidades</p>
                      <p className="text-xs mt-2">💡 Inclua habilidades técnicas e comportamentais relevantes</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resumeData.skills.map((skill) => (
                        <div key={skill.id} className="flex gap-3 items-end">
                          <div className="flex-1">
                            <Label>Habilidade</Label>
                            <Input
                              placeholder="Ex: React, Liderança, Excel"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="w-40">
                            <Label>Nível</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                              value={skill.level}
                              onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                            >
                              <option>Básico</option>
                              <option>Intermediário</option>
                              <option>Avançado</option>
                              <option>Especialista</option>
                            </select>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(skill.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Botão de Visualizar */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handlePreview}
                    disabled={!isFormComplete()}
                    className={`bg-gradient-to-r ${templateColors.primary} text-white px-12 py-6 text-lg font-semibold shadow-xl`}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Visualizar Currículo Completo
                  </Button>
                </div>

                {!isFormComplete() && (
                  <p className="text-center text-sm text-gray-500">
                    ⚠️ Preencha todos os campos obrigatórios (*) para visualizar seu currículo
                  </p>
                )}
              </div>

              {/* Preview em Tempo Real */}
              <div className="lg:sticky lg:top-4 h-fit">
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Preview em Tempo Real</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>

                  {renderTemplatePreview()}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Resume Preview Section (Completo) */}
        {showPreview && isFormComplete() && (
          <div id="resume-preview-section" className="max-w-4xl mx-auto mb-16">
            <Card className="p-12 bg-white dark:bg-gray-800 shadow-2xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">Seu Currículo Está Pronto! 🎉</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {hasSubscription 
                    ? "Clique no botão abaixo para baixar seu currículo em PDF."
                    : "Para baixar em PDF, escolha um plano abaixo."}
                </p>
              </div>

              {/* Currículo Completo */}
              <div className={`border-4 ${templateColors.border} rounded-xl p-10 bg-white dark:bg-gray-900 mb-8`}>
                {/* Header */}
                <div className={`border-b-4 ${templateColors.border} pb-6 mb-6 text-center`}>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {resumeData.personalInfo.fullName}
                  </h1>
                  <p className={`text-xl ${templateColors.accent} font-semibold mb-4`}>
                    {resumeData.personalInfo.professionalTitle}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {resumeData.personalInfo.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {resumeData.personalInfo.phone}
                    </span>
                    {resumeData.personalInfo.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {resumeData.personalInfo.location}
                      </span>
                    )}
                  </div>
                  {(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) && (
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-600 mt-2">
                      {resumeData.personalInfo.linkedin && (
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {resumeData.personalInfo.linkedin}
                        </span>
                      )}
                      {resumeData.personalInfo.portfolio && (
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {resumeData.personalInfo.portfolio}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Resumo */}
                {resumeData.personalInfo.summary && (
                  <div className="mb-6">
                    <h2 className={`text-xl font-bold ${templateColors.accent} mb-3 uppercase tracking-wide`}>
                      Resumo Profissional
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {resumeData.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Experiência */}
                <div className="mb-6">
                  <h2 className={`text-xl font-bold ${templateColors.accent} mb-4 uppercase tracking-wide flex items-center gap-2`}>
                    <Briefcase className="w-5 h-5" />
                    Experiência Profissional
                  </h2>
                  <div className="space-y-5">
                    {resumeData.experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exp.company}</h3>
                            <p className="text-md text-gray-700 dark:text-gray-300 font-semibold">{exp.position}</p>
                          </div>
                          <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                            {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educação */}
                <div className="mb-6">
                  <h2 className={`text-xl font-bold ${templateColors.accent} mb-4 uppercase tracking-wide flex items-center gap-2`}>
                    <GraduationCap className="w-5 h-5" />
                    Educação
                  </h2>
                  <div className="space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.institution}</h3>
                            <p className="text-md text-gray-700 dark:text-gray-300">
                              {edu.degree} em {edu.field}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                            {edu.startDate} - {edu.current ? "Cursando" : edu.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Habilidades */}
                <div>
                  <h2 className={`text-xl font-bold ${templateColors.accent} mb-4 uppercase tracking-wide flex items-center gap-2`}>
                    <Award className="w-5 h-5" />
                    Habilidades
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resumeData.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`px-4 py-2 ${templateColors.secondary} ${templateColors.accent} rounded-lg font-medium`}
                      >
                        {skill.name} <span className="text-xs">({skill.level})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão de Download */}
              <div className="text-center">
                {hasSubscription ? (
                  <Button
                    size="lg"
                    onClick={handleDownloadPDF}
                    className={`bg-gradient-to-r ${templateColors.primary} text-white px-16 py-8 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all`}
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Baixar Currículo em PDF
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      onClick={handleDownloadPDF}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-16 py-8 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all"
                    >
                      <Lock className="w-6 h-6 mr-3" />
                      Desbloquear Download em PDF
                    </Button>
                    <p className="text-sm text-gray-500">
                      ⬇️ Escolha um plano abaixo para baixar seu currículo
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Features Grid */}
        <div id="features-section" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card 
            className="p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:border-blue-500 cursor-pointer"
            onClick={handleViewTemplates}
            onMouseEnter={() => setActiveSection('templates')}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 ${activeSection === 'templates' ? 'scale-110' : ''}`}>
              <Layout className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Modelos Profissionais</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Escolha entre diversos templates modernos e elegantes, criados por designers profissionais
            </p>
          </Card>

          <Card 
            className="p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:border-purple-500 cursor-pointer"
            onClick={() => handleCreateResume('default')}
            onMouseEnter={() => setActiveSection('editor')}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 ${activeSection === 'editor' ? 'scale-110' : ''}`}>
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Editor Intuitivo</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Arraste e solte seções facilmente, edite em tempo real e veja as mudanças instantaneamente
            </p>
          </Card>

          <Card 
            className="p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:border-yellow-500 cursor-pointer"
            onClick={() => handleCreateResume('default')}
            onMouseEnter={() => setActiveSection('tips')}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 ${activeSection === 'tips' ? 'scale-110' : ''}`}>
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Dicas Inteligentes</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Receba sugestões automáticas para melhorar seu currículo e destacar suas conquistas
            </p>
          </Card>
        </div>

        {/* Templates Section */}
        <div id="templates-section" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Modelos para Todas as Áreas</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Templates especializados para destacar suas habilidades em qualquer setor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tecnologia */}
            <Card id="template-tecnologia" className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-blue-500">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tecnologia</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Perfeito para desenvolvedores, engenheiros e profissionais de TI
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 active:scale-95"
                onClick={() => handleViewTemplateSection('Tecnologia')}
              >
                Ver Modelo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Design */}
            <Card id="template-design" className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-purple-500">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4">
                <PaletteIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Design</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Ideal para designers, criativos e profissionais visuais
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-purple-50 dark:hover:bg-purple-950 transition-all duration-300 active:scale-95"
                onClick={() => handleViewTemplateSection('Design')}
              >
                Ver Modelo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Marketing */}
            <Card id="template-marketing" className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-pink-500">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Marketing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Destaque suas campanhas e resultados de marketing
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-pink-50 dark:hover:bg-pink-950 transition-all duration-300 active:scale-95"
                onClick={() => handleViewTemplateSection('Marketing')}
              >
                Ver Modelo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Vendas */}
            <Card id="template-vendas" className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-green-500">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vendas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Mostre suas conquistas e metas alcançadas
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300 active:scale-95"
                onClick={() => handleViewTemplateSection('Vendas')}
              >
                Ver Modelo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Financeiro */}
            <Card id="template-financeiro" className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-500">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Financeiro</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Para analistas, contadores e gestores financeiros
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-orange-50 dark:hover:bg-orange-950 transition-all duration-300 active:scale-95"
                onClick={() => handleViewTemplateSection('Financeiro')}
              >
                Ver Modelo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* RH */}
            <Card id="template-recursos-humanos" className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-indigo-500">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Recursos Humanos</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Especializado para profissionais de RH e gestão de pessoas
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300 active:scale-95"
                onClick={() => handleViewTemplateSection('Recursos Humanos')}
              >
                Ver Modelo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>

        {/* Template Previews - Tecnologia */}
        <div id="template-preview-tecnologia" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold">Modelo Tecnologia</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Design moderno e técnico, ideal para destacar projetos e habilidades de programação
            </p>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="border-4 border-blue-500 rounded-lg p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
              {/* Header Tech Style */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg mb-6">
                <h1 className="text-3xl font-bold mb-2">João Silva</h1>
                <p className="text-xl mb-3">Desenvolvedor Full Stack</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>📧 joao@email.com</span>
                  <span>📱 (11) 99999-9999</span>
                  <span>💼 github.com/joaosilva</span>
                </div>
              </div>

              {/* Tech Skills Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  STACK TÉCNICO
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-center">
                    <p className="font-bold text-blue-700 dark:text-blue-300">React</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avançado</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-center">
                    <p className="font-bold text-blue-700 dark:text-blue-300">Node.js</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avançado</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-center">
                    <p className="font-bold text-blue-700 dark:text-blue-300">TypeScript</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Intermediário</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-center">
                    <p className="font-bold text-blue-700 dark:text-blue-300">PostgreSQL</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Intermediário</p>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-600">PROJETOS DESTACADOS</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-bold">Sistema de E-commerce</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Plataforma completa com React, Node.js e PostgreSQL. +10k usuários ativos.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-bold">API RESTful de Pagamentos</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Integração com múltiplos gateways. Processamento de 1M+ transações/mês.
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-blue-600">EXPERIÊNCIA</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">Tech Solutions Inc.</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Desenvolvedor Full Stack Sênior</p>
                      </div>
                      <span className="text-sm text-gray-500">2021 - Presente</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Desenvolvimento de aplicações web escaláveis. Liderança técnica de equipe de 5 desenvolvedores.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => handleCreateResume('tecnologia')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold"
              >
                Usar Este Modelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Template Previews - Design */}
        <div id="template-preview-design" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <PaletteIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">Modelo Design</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Layout criativo e visual, perfeito para mostrar portfólio e projetos de design
            </p>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="border-4 border-purple-500 rounded-lg p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
              {/* Creative Header */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  MS
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Maria Santos
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-3">Designer UX/UI</p>
                <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>maria@design.com</span>
                  <span>•</span>
                  <span>behance.net/mariasantos</span>
                </div>
              </div>

              {/* Creative Summary */}
              <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-center italic text-gray-700 dark:text-gray-300">
                  "Designer apaixonada por criar experiências digitais memoráveis que conectam pessoas e marcas"
                </p>
              </div>

              {/* Portfolio Highlights */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-purple-600 text-center">PORTFÓLIO EM DESTAQUE</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg">
                    <div className="aspect-video bg-white dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
                      <PaletteIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-sm">App de Meditação</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">UI/UX Design</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg">
                    <div className="aspect-video bg-white dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
                      <PaletteIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-sm">E-commerce Fashion</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Web Design</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg">
                    <div className="aspect-video bg-white dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
                      <PaletteIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-sm">Dashboard Analytics</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Interface Design</p>
                  </div>
                </div>
              </div>

              {/* Skills Visual */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-purple-600">HABILIDADES</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">Figma</span>
                      <span className="text-sm text-gray-500">95%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">Adobe XD</span>
                      <span className="text-sm text-gray-500">90%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{width: '90%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">Prototyping</span>
                      <span className="text-sm text-gray-500">85%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-purple-600">EXPERIÊNCIA</h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">Creative Studio</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Designer UX/UI Sênior</p>
                      </div>
                      <span className="text-sm text-gray-500">2020 - Presente</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Liderança de projetos de design para clientes Fortune 500. Aumento de 40% na satisfação do usuário.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => handleCreateResume('design')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold"
              >
                Usar Este Modelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Template Previews - Marketing */}
        <div id="template-preview-marketing" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-3xl font-bold">Modelo Marketing</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Focado em resultados e métricas, ideal para profissionais de marketing digital
            </p>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="border-4 border-pink-500 rounded-lg p-8 bg-white dark:bg-gray-900">
              {/* Header Marketing Style */}
              <div className="border-b-4 border-pink-500 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Carlos Mendes</h1>
                <p className="text-xl text-pink-600 font-semibold mb-3">Especialista em Marketing Digital</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>📧 carlos@marketing.com</span>
                  <span>📱 (11) 98888-8888</span>
                  <span>🔗 linkedin.com/in/carlosmendes</span>
                </div>
              </div>

              {/* Key Achievements */}
              <div className="mb-6 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  RESULTADOS COMPROVADOS
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-pink-600">+250%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ROI em Campanhas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-pink-600">R$ 5M+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget Gerenciado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-pink-600">50+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Campanhas Lançadas</p>
                  </div>
                </div>
              </div>

              {/* Core Competencies */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-pink-600">COMPETÊNCIAS PRINCIPAIS</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">Google Ads & Meta Ads</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">SEO & SEM</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">Marketing de Conteúdo</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">Analytics & Data-Driven</span>
                  </div>
                </div>
              </div>

              {/* Campaign Highlights */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-pink-600">CAMPANHAS DE DESTAQUE</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-pink-500 pl-4">
                    <h3 className="font-bold">Lançamento de Produto Tech</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Campanha integrada que gerou 10k leads qualificados em 30 dias. ROI de 320%.
                    </p>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-4">
                    <h3 className="font-bold">Rebranding E-commerce</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estratégia de conteúdo que aumentou tráfego orgânico em 180% em 6 meses.
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-pink-600">EXPERIÊNCIA PROFISSIONAL</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">Digital Marketing Agency</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Head de Marketing Digital</p>
                      </div>
                      <span className="text-sm text-gray-500">2019 - Presente</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Liderança de equipe de 12 profissionais. Gestão de portfólio de 30+ clientes. Crescimento de 200% em receita.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => handleCreateResume('marketing')}
                className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold"
              >
                Usar Este Modelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Template Previews - Vendas */}
        <div id="template-preview-vendas" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold">Modelo Vendas</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Destaque suas conquistas e números de vendas de forma impactante
            </p>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="border-4 border-green-500 rounded-lg p-8 bg-white dark:bg-gray-900">
              {/* Sales Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg mb-6">
                <h1 className="text-3xl font-bold mb-2">Ana Costa</h1>
                <p className="text-xl mb-3">Executiva de Vendas B2B</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>📧 ana@vendas.com</span>
                  <span>📱 (11) 97777-7777</span>
                  <span>🏆 Top Performer 2023</span>
                </div>
              </div>

              {/* Sales Performance */}
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  PERFORMANCE DE VENDAS
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">R$ 8M</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vendas Totais 2023</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">150%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Acima da Meta</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">200+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Fechados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">95%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Retenção</p>
                  </div>
                </div>
              </div>

              {/* Key Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-green-600">HABILIDADES CHAVE</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Prospecção B2B</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Negociação Estratégica</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">CRM (Salesforce)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Account Management</span>
                  </div>
                </div>
              </div>

              {/* Major Deals */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-green-600">NEGOCIAÇÕES DE DESTAQUE</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">Contrato Enterprise - Tech Corp</h3>
                      <span className="text-green-600 font-bold">R$ 2.5M</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Maior contrato da empresa em 2023. Ciclo de vendas de 6 meses.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">Expansão Regional - Retail Group</h3>
                      <span className="text-green-600 font-bold">R$ 1.8M</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expansão de contrato existente. Upsell de 300%.
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-green-600">EXPERIÊNCIA PROFISSIONAL</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">SaaS Solutions Inc.</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Executiva de Vendas Sênior</p>
                      </div>
                      <span className="text-sm text-gray-500">2020 - Presente</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Responsável por carteira de clientes enterprise. Superação de meta por 3 anos consecutivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => handleCreateResume('vendas')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold"
              >
                Usar Este Modelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Template Previews - Financeiro */}
        <div id="template-preview-financeiro" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold">Modelo Financeiro</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Profissional e estruturado, ideal para analistas e gestores financeiros
            </p>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="border-4 border-orange-500 rounded-lg p-8 bg-white dark:bg-gray-900">
              {/* Finance Header */}
              <div className="border-b-4 border-orange-500 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Pedro Oliveira</h1>
                <p className="text-xl text-orange-600 font-semibold mb-3">Analista Financeiro Sênior | CFA</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>📧 pedro@financas.com</span>
                  <span>📱 (11) 96666-6666</span>
                  <span>🎓 MBA em Finanças - FGV</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                <h2 className="text-lg font-bold mb-2 text-orange-600">RESUMO EXECUTIVO</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Analista financeiro com 8+ anos de experiência em análise de investimentos, modelagem financeira e gestão de portfólio. 
                  Especialista em valuation e due diligence. Track record de identificação de oportunidades que geraram R$ 50M+ em retorno.
                </p>
              </div>

              {/* Core Competencies */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-orange-600 flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  COMPETÊNCIAS TÉCNICAS
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-bold text-sm mb-1">Análise & Modelagem</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Valuation, DCF, LBO, M&A</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-bold text-sm mb-1">Ferramentas</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Excel Avançado, Bloomberg, SAP</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-bold text-sm mb-1">Relatórios</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">FP&A, Budget, Forecast</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-bold text-sm mb-1">Certificações</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">CFA Level II, CPA</p>
                  </div>
                </div>
              </div>

              {/* Key Achievements */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-orange-600">PRINCIPAIS REALIZAÇÕES</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Liderou análise de M&A que resultou em aquisição estratégica de R$ 120M
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Implementou modelo de forecast que melhorou acurácia em 35%
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Identificou oportunidades de redução de custos que economizaram R$ 8M/ano
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-orange-600">EXPERIÊNCIA PROFISSIONAL</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Investment Bank Corp</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Analista Financeiro Sênior</p>
                      </div>
                      <span className="text-sm text-gray-500">2019 - Presente</span>
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• Análise de investimentos em setores de tecnologia e varejo</li>
                      <li>• Modelagem financeira para transações de M&A (R$ 500M+)</li>
                      <li>• Preparação de relatórios executivos para C-level</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-orange-600">FORMAÇÃO ACADÊMICA</h2>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold">MBA em Finanças Corporativas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fundação Getulio Vargas (FGV) • 2018</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Bacharelado em Economia</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Universidade de São Paulo (USP) • 2015</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => handleCreateResume('financeiro')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-6 text-lg font-semibold"
              >
                Usar Este Modelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Template Previews - Recursos Humanos */}
        <div id="template-preview-recursos-humanos" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold">Modelo Recursos Humanos</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Focado em gestão de pessoas e desenvolvimento organizacional
            </p>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="border-4 border-indigo-500 rounded-lg p-8 bg-white dark:bg-gray-900">
              {/* HR Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg mb-6">
                <h1 className="text-3xl font-bold mb-2">Juliana Ferreira</h1>
                <p className="text-xl mb-3">Gerente de Recursos Humanos</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>📧 juliana@rh.com</span>
                  <span>📱 (11) 95555-5555</span>
                  <span>🎓 SHRM-CP Certified</span>
                </div>
              </div>

              {/* HR Summary */}
              <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500">
                <h2 className="text-lg font-bold mb-2 text-indigo-600">PERFIL PROFISSIONAL</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Profissional de RH com 10+ anos de experiência em gestão de pessoas, cultura organizacional e desenvolvimento de talentos. 
                  Especialista em transformação cultural e employee experience. Liderou iniciativas que reduziram turnover em 40%.
                </p>
              </div>

              {/* Core HR Competencies */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-indigo-600 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  ÁREAS DE ESPECIALIZAÇÃO
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">Recrutamento & Seleção</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">Desenvolvimento de Talentos</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">Cultura Organizacional</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">Employee Experience</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">Performance Management</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">People Analytics</span>
                  </div>
                </div>
              </div>

              {/* Key Initiatives */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-indigo-600">INICIATIVAS DE DESTAQUE</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-bold">Programa de Desenvolvimento de Lideranças</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Criação e implementação de programa que capacitou 50+ líderes. Aumento de 35% em engajamento.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-bold">Transformação Cultural</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Liderou mudança cultural em empresa de 500+ colaboradores. Redução de 40% no turnover.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-bold">Sistema de Avaliação de Desempenho</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Implementação de novo modelo de avaliação 360°. Satisfação de 92% entre colaboradores.
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-indigo-600">EXPERIÊNCIA PROFISSIONAL</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Tech Innovation Corp</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Gerente de Recursos Humanos</p>
                      </div>
                      <span className="text-sm text-gray-500">2018 - Presente</span>
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• Gestão de equipe de 8 profissionais de RH</li>
                      <li>• Responsável por RH de 500+ colaboradores</li>
                      <li>• Liderança de projetos de transformação cultural</li>
                      <li>• Implementação de programas de D&I (Diversidade & Inclusão)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education & Certifications */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-indigo-600">FORMAÇÃO & CERTIFICAÇÕES</h2>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold">MBA em Gestão de Pessoas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">FIA - Fundação Instituto de Administração • 2017</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Bacharelado em Psicologia Organizacional</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">PUC-SP • 2013</p>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-bold text-sm">Certificações:</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">SHRM-CP, Coaching Executivo (ICI), People Analytics (ABRH)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => handleCreateResume('recursos-humanos')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold"
              >
                Usar Este Modelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Pricing Section */}
        <div id="pricing-section" className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Planos que Cabem no Seu Bolso</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Diário */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Diário</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R$ 7,90</span>
                  <span className="text-gray-600 dark:text-gray-400">/dia</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Acesso por 24 horas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Download ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Todos os modelos</span>
                </li>
              </ul>
              <div id="daily-payment-button" className="w-full">
                {/* Script do Mercado Pago será injetado aqui com texto "Começar Agora" */}
              </div>
            </Card>

            {/* Plano Mensal */}
            <Card className="p-8 border-4 border-purple-500 relative hover:shadow-2xl transition-all transform scale-105 hover:scale-110">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                MAIS POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Mensal</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R$ 19,90</span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Acesso por 30 dias</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Download ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Atualizações ilimitadas</span>
                </li>
              </ul>
              <div id="monthly-payment-button" className="w-full">
                {/* Script do Mercado Pago será injetado aqui com texto "Começar Agora" */}
              </div>
            </Card>

            {/* Plano Anual */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-xs font-bold mb-4">
                  ECONOMIZE 65%
                </div>
                <h3 className="text-2xl font-bold mb-2">Anual</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">R$ 89,90</span>
                  <span className="text-gray-600 dark:text-gray-400">/ano</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Apenas R$ 7,49/mês
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Acesso por 365 dias</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Download ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Suporte VIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Modelos exclusivos</span>
                </li>
              </ul>
              <div id="annual-payment-button" className="w-full">
                {/* Script do Mercado Pago será injetado aqui com texto "Começar Agora" */}
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Comece agora - Teste gratuitamente
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para criar seu currículo profissional?
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Junte-se a milhares de profissionais que já transformaram suas carreiras
          </p>
          
          <Button 
            size="lg"
            onClick={() => handleCreateResume('default')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-7 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Criar Meu Primeiro Currículo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
