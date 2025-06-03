import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, CreditCard, Calendar, User, LogOut, Tag, FileText } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { UserProfile } from './UserProfile'
import { useTheme } from '@/hooks/useTheme'

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Transações', url: '/transacoes', icon: CreditCard },
  { title: 'Categorias', url: '/categorias', icon: Tag },
  { title: 'Relatórios', url: '/relatorios', icon: FileText },
  { title: 'Lembretes', url: '/lembretes', icon: Calendar },
  { title: 'Perfil', url: '/perfil', icon: User },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { theme } = useTheme()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    if (theme === 'dark') {
      return '/lovable-uploads/bd48b065-36ce-4af8-926d-a1f05a2d43c5.png' // logo-black
    } else if (theme === 'light') {
      return '/lovable-uploads/b679a5ba-8a42-42cc-bc36-ccf4569fa05f.png' // logo-white
    } else {
      // System theme - check actual computed theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark 
        ? '/lovable-uploads/bd48b065-36ce-4af8-926d-a1f05a2d43c5.png'
        : '/lovable-uploads/b679a5ba-8a42-42cc-bc36-ccf4569fa05f.png'
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          {isCollapsed ? (
            <div className="min-w-8">
              <img 
                src="/lovable-uploads/a5a40de7-4096-4a32-af0c-76fe03ec72f7.png"
                alt="FinanceFlow Icon" 
                className="h-8 w-8"
              />
            </div>
          ) : (
            <img 
              src={getLogoSrc()} 
              alt="FinanceFlow" 
              className="h-8 w-auto"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      isActive(item.url)
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        <UserProfile />
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          size={isCollapsed ? "icon" : "default"}
          className="w-full"
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden ml-2">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
