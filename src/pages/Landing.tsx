import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CheckCircle, MessageSquare, Clock, Shield, Users, ArrowRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const getLogoSrc = () => {
    if (theme === 'dark') {
      return '/lovable-uploads/bd48b065-36ce-4af8-926d-a1f05a2d43c5.png'
    } else if (theme === 'light') {
      return '/lovable-uploads/b679a5ba-8a42-42cc-bc36-ccf4569fa05f.png'
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark 
        ? '/lovable-uploads/bd48b065-36ce-4af8-926d-a1f05a2d43c5.png'
        : '/lovable-uploads/b679a5ba-8a42-42cc-bc36-ccf4569fa05f.png'
    }
  }

  const benefits = [
    {
      icon: MessageSquare,
      title: "Atendimento Instantâneo",
      description: "Seu agente financeiro responde em segundos, direto no WhatsApp que você já usa todos os dias"
    },
    {
      icon: Clock,
      title: "Disponível 24/7",
      description: "Consulte saldos, tire dúvidas e receba orientações financeiras a qualquer hora do dia"
    },
    {
      icon: Shield,
      title: "Seguro e Confiável",
      description: "Todas as suas informações são protegidas com criptografia de ponta a ponta"
    },
    {
      icon: Users,
      title: "Consultoria Humanizada",
      description: "Receba dicas personalizadas e orientações financeiras sem burocracia ou linguagem técnica"
    }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empreendedora",
      content: "Agora consigo acompanhar minhas finanças de forma simples. O agente me ajuda com dicas práticas todos os dias!",
      avatar: "/lovable-uploads/a5a40de7-4096-4a32-af0c-76fe03ec72f7.png"
    },
    {
      name: "João Santos",
      role: "Freelancer",
      content: "Revolucionou minha organização financeira. É como ter um consultor pessoal no bolso, sempre disponível.",
      avatar: "/lovable-uploads/3e6efeb8-4963-4a6b-9548-e1ce00ab987b.png"
    },
    {
      name: "Ana Costa",
      role: "Professora",
      content: "Finalmente entendo minhas finanças! O agente explica tudo de forma clara e me ajuda a tomar decisões melhores.",
      avatar: "/lovable-uploads/4e61242f-e04e-4263-906b-8a80195f4163.png"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/07af976e-aaeb-4c23-8af4-03689ff8bda4.png" 
              alt="finzap" 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground"
            >
              Fazer Login
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit text-primary border-primary/20">
                  ✨ Seu consultor financeiro pessoal
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Gerencie suas{' '}
                  <span className="text-primary">finanças</span>{' '}
                  direto no{' '}
                  <span className="text-primary">WhatsApp</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Tenha um agente financeiro pessoal disponível 24/7 para consultas, dicas e orientações. 
                  Tudo isso no aplicativo que você já usa todos os dias.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/auth')}
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-lg"
                >
                  Ver Demonstração
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Grátis para começar
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Sem burocracias
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  100% seguro
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/lovable-uploads/7a9a766e-0b47-43d5-9605-b2ec2dcd0803.png"
                  alt="Gestão financeira inteligente"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform translate-x-4 translate-y-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Por que escolher nosso agente financeiro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Transforme sua relação com o dinheiro através de uma experiência simples, 
              humanizada e sempre disponível no seu WhatsApp.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Experience Demo */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Uma experiência que você já conhece
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Não precisa aprender nada novo. Seu agente financeiro funciona exatamente 
                como uma conversa normal no WhatsApp, mas com a inteligência para te ajudar 
                com suas finanças.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Consultas instantâneas</p>
                    <p className="text-muted-foreground">Pergunte sobre saldos, gastos ou investimentos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Dicas personalizadas</p>
                    <p className="text-muted-foreground">Receba orientações baseadas no seu perfil</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Lembretes inteligentes</p>
                    <p className="text-muted-foreground">Nunca mais esqueça de pagar uma conta</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="max-w-sm mx-auto bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Agente FinanceFlow</p>
                      <p className="text-xs text-muted-foreground">online agora</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm p-3 shadow-sm">
                      <p className="text-sm">Olá! Como posso te ajudar hoje? 😊</p>
                    </div>
                    
                    <div className="bg-green-500 text-white rounded-2xl rounded-br-sm p-3 ml-8">
                      <p className="text-sm">Qual foi meu gasto com alimentação este mês?</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm p-3 shadow-sm">
                      <p className="text-sm">Você gastou R$ 847 com alimentação em novembro. Isso representa 23% da sua renda mensal. Quer algumas dicas para otimizar? 💡</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              O que nossos usuários estão dizendo
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Milhares de pessoas já transformaram sua vida financeira com nosso agente inteligente.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300">
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Comece hoje mesmo a transformar suas finanças
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Junte-se a milhares de pessoas que já descobriram como é fácil ter controle 
              total das finanças com a ajuda do nosso agente inteligente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="h-14 px-8 text-lg"
                onClick={() => navigate('/auth')}
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-sm text-white/70">
              Sem cartão de crédito • Sem compromisso • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={getLogoSrc()} 
                alt="FinanceFlow" 
                className="h-6 w-auto"
              />
              <p className="text-sm text-muted-foreground">
                © 2024 FinanceFlow. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
