
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, TrendingUp, Bell, Users, Star, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "Controle Financeiro Inteligente",
      description: "Acompanhe suas receitas e despesas com gráficos intuitivos e relatórios detalhados."
    },
    {
      icon: Bell,
      title: "Lembretes Personalizados",
      description: "Nunca mais esqueça de um pagamento importante com nossos alertas inteligentes."
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Seus dados financeiros protegidos com criptografia de ponta e backup automático."
    }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empreendedora",
      content: "O financeFlow mudou completamente como gerencio minhas finanças. Agora tenho controle total sobre meus gastos.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Freelancer",
      content: "Simples, intuitivo e eficiente. Consegui organizar minhas finanças em poucos minutos.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Consultora",
      content: "Os relatórios são fantásticos! Me ajudam a tomar decisões financeiras mais inteligentes.",
      rating: 5
    }
  ]

  const benefits = [
    "Interface intuitiva e fácil de usar",
    "Sincronização em todos os dispositivos",
    "Relatórios detalhados e personalizáveis",
    "Segurança de dados garantida",
    "Suporte técnico especializado",
    "Atualizações constantes e gratuitas"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold title-color">financeFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold title-color leading-tight">
                Transforme suas
                <span className="text-primary block">finanças pessoais</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Gerencie seu dinheiro de forma simples e inteligente. 
                Controle gastos, organize receitas e alcance seus objetivos financeiros 
                com o financeFlow.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Ver Demonstração
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">+5.000 usuários ativos</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.9/5 avaliação</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="/lovable-uploads/7a9a766e-0b47-43d5-9605-b2ec2dcd0803.png"
                alt="Dashboard do financeFlow"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold title-color">
              Tudo que você precisa para suas finanças
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas e intuitivas para você ter controle total 
              sobre seu dinheiro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold title-color">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold title-color">
                  Por que escolher o financeFlow?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Uma solução completa pensada para simplificar sua vida financeira
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6">
                  Experimentar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="/lovable-uploads/f49ea338-eba8-4e12-b460-c6276f4c4a93.png"
                alt="Recursos do financeFlow"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold title-color">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de pessoas que transformaram suas finanças
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold title-color">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary text-white p-12 text-center">
            <CardContent className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Pronto para transformar suas finanças?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Junte-se a milhares de pessoas que já estão no controle de suas finanças. 
                Comece hoje mesmo, é grátis!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    Criar Conta Gratuita
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold title-color">financeFlow</span>
              </div>
              <p className="text-muted-foreground">
                Seu assistente financeiro pessoal para uma vida mais organizada e próspera.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold title-color">Produto</h4>
              <div className="space-y-2">
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Recursos</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Preços</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Segurança</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold title-color">Suporte</h4>
              <div className="space-y-2">
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Central de Ajuda</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Contato</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Status</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold title-color">Empresa</h4>
              <div className="space-y-2">
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Sobre</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Blog</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer">Carreiras</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 financeFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
