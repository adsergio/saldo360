
import { NavLink, useLocation } from 'react-router-dom'
import { Home, CreditCard, Calendar, User, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Transações', url: '/transacoes', icon: CreditCard },
  { title: 'Lembretes', url: '/lembretes', icon: Calendar },
  { title: 'Perfil', url: '/perfil', icon: User },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { signOut } = useAuth()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isCollapsed = state === "collapsed"
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-medium' : 'hover:bg-gray-100'

  return (
    <Sidebar
      className={isCollapsed ? 'w-14' : 'w-60'}
      collapsible="offcanvas"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent ${isCollapsed ? 'hidden' : ''}`}>
            FinanceFlow
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            onClick={signOut}
            variant="outline"
            className={`w-full ${isCollapsed ? 'px-2' : ''}`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
