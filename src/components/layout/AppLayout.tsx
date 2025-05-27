
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Sistema de Gestão Financeira
              </h1>
            </div>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
