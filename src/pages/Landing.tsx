
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, MessageCircle, Shield, TrendingUp, Users, Clock, Heart } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0e02cb29-7320-4267-a2e1-28667696a3f3.png" 
              alt="FinZap" 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://auth.finzap.app.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Já sou cliente
            </a>
            <Button 
              asChild 
              variant="outline"
            >
              <a 
                href="https://auth.finzap.app.br" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Fazer Login
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Seu agente financeiro
              <span className="text-primary block">direto no WhatsApp</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Controle suas finanças, tire dúvidas e receba orientações personalizadas. 
              Tudo isso de forma simples, rápida e humanizada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                asChild
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                <a 
                  href="https://www.asaas.com/c/5ymcu81k0kpwudb5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Assinar por R$ 29,99/mês
                </a>
              </Button>
              <p className="text-sm text-gray-500">
                ✨ Cancele quando quiser
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span>Via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Atendimento Humano</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Como funciona na prática
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nosso agente financeiro está sempre disponível no seu WhatsApp para 
                ajudar com suas finanças, tirar dúvidas e dar orientações personalizadas.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Conversa Natural</h3>
                    <p className="text-gray-600">Fale como se fosse com um amigo, sem complicação</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Resposta Rápida</h3>
                    <p className="text-gray-600">Atendimento ágil quando você precisar</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Orientação Personalizada</h3>
                    <p className="text-gray-600">Dicas e estratégias baseadas no seu perfil</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">FinZap Assistant</h4>
                    <p className="text-sm text-green-500">● online</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Oi! Como posso te ajudar hoje? 😊</p>
                  </div>
                  
                  <div className="bg-primary text-white rounded-2xl rounded-br-md p-3 max-w-xs ml-auto">
                    <p className="text-sm">Quero organizar meu orçamento mensal</p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Perfeito! Vou te ajudar a criar um plano personalizado. Primeiro, me conta qual é sua renda mensal? 💰</p>
                  </div>
                  
                  <div className="bg-primary text-white rounded-2xl rounded-br-md p-3 max-w-xs ml-auto">
                    <p className="text-sm">R$ 3.500</p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Ótimo! Vou montar uma planilha personalizada para você. Te ajudo também com dicas de economia 📊✨</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o FinZap?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mais que um app, você tem um consultor financeiro pessoal sempre disponível
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Atendimento Humanizado</h3>
                <p className="text-gray-600 leading-relaxed">
                  Converse com pessoas reais que entendem suas necessidades financeiras
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Segurança Total</h3>
                <p className="text-gray-600 leading-relaxed">
                  Seus dados protegidos com a mais alta tecnologia de segurança
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultoria Personalizada</h3>
                <p className="text-gray-600 leading-relaxed">
                  Estratégias financeiras feitas especialmente para o seu perfil
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Tudo que você precisa em um só lugar
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Controle de Gastos</h3>
                    <p className="text-gray-600">Acompanhe suas receitas e despesas de forma simples</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Planejamento de Orçamento</h3>
                    <p className="text-gray-600">Crie metas e organize suas finanças mensais</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lembretes Inteligentes</h3>
                    <p className="text-gray-600">Nunca mais esqueça de pagar uma conta</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Relatórios Detalhados</h3>
                    <p className="text-gray-600">Visualize sua evolução financeira com gráficos claros</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Suporte 24/7 via WhatsApp</h3>
                    <p className="text-gray-600">Tire dúvidas e receba orientações quando precisar</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <img
                src="/lovable-uploads/7a9a766e-0b47-43d5-9605-b2ec2dcd0803.png"
                alt="App FinZap"
                className="max-w-full h-auto mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-gray-600">
              Histórias reais de pessoas que transformaram suas finanças
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Marina Silva</h4>
                    <p className="text-sm text-gray-600">Empresária</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  "O FinZap mudou completamente minha relação com o dinheiro. Ter um consultor no WhatsApp é incrível!"
                </p>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Roberto Santos</h4>
                    <p className="text-sm text-gray-600">Professor</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  "Finalmente consegui organizar meu orçamento. O atendimento é super atencioso e as dicas são valiosas."
                </p>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ana Costa</h4>
                    <p className="text-sm text-gray-600">Designer</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  "Já economizei mais de R$ 500 no primeiro mês seguindo as orientações. Vale muito a pena!"
                </p>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Comece hoje mesmo
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Por menos de R$ 1 por dia, tenha acesso a consultoria financeira personalizada
          </p>
          
          <Card className="max-w-md mx-auto border-2 border-primary shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Mensal</h3>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <span className="text-4xl font-bold text-primary">R$ 29,99</span>
                  <span className="text-lg text-gray-600">/mês</span>
                </div>
                <p className="text-sm text-gray-600">Cancele quando quiser</p>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Atendimento via WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Consultoria financeira personalizada</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Controle completo de gastos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios e metas personalizadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Lembretes inteligentes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </div>
              </div>
              
              <Button 
                asChild
                size="lg" 
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
              >
                <a 
                  href="https://www.asaas.com/c/5ymcu81k0kpwudb5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Assinar Agora
                </a>
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                Pagamento seguro • Cancele quando quiser
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Transforme sua vida financeira hoje
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a milhares de pessoas que já melhoraram suas finanças com o FinZap
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            >
              <a 
                href="https://www.asaas.com/c/5ymcu81k0kpwudb5" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Assinar por R$ 29,99/mês
              </a>
            </Button>
            
            <Button 
              asChild
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary"
            >
              <a 
                href="https://auth.finzap.app.br" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Já sou cliente
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/0e02cb29-7320-4267-a2e1-28667696a3f3.png" 
                alt="FinZap" 
                className="h-8 w-auto mr-4"
              />
              <span className="text-sm text-gray-400">
                © 2024 FinZap. Todos os direitos reservados.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
