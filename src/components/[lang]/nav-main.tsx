import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/[lang]/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/[lang]/ui/sidebar";
import { ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon | React.ReactNode;  
  items?: {
    title: string
    url: string
    icon?: LucideIcon | React.ReactNode;
  }[];
}

export function NavMain({
  items,
  label
}: {
  items: NavItem[]
  label?: string
}) {
  const pathname = usePathname();  

 
  const isActive = (url: string) => {
    const languagePrefix = pathname.split('/')[1];
    const normalizedPathname = pathname.replace(`/${languagePrefix}`, '');

    if (url === '/dashboard') {
      return normalizedPathname === url;
    }

    return normalizedPathname === url;
  };

  const pageTitle = items[0]?.title || "Default Title"; 

  return (
    <>
      <SidebarGroup className='text-[#7E7E7E]'>
        {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => {
            if (item.items && item.items.length > 0) {
              return (
                <Collapsible key={item.title} asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        isActive={isActive(item.url)}
                        className="data-[active=true]:text-[#53B4AB]"
                      >
                        {item.icon && React.isValidElement(item.icon) && <>{item.icon}</>}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className="data-[active=true]:text-[#53B4AB]"
                              isActive={isActive(subItem.url)}
                            >
                              <Link href={subItem.url}>
                                {subItem.icon && React.isValidElement(subItem.icon) && <>{subItem.icon}</>} 
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  isActive={isActive(item.url)}
                  className="data-[active=true]:text-[#53B4AB]"
                >
                  <Link href={item.url}>
                    {item.icon && React.isValidElement(item.icon) && <>{item.icon}</>} 
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
