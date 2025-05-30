
import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';

interface CategorySingleSelectorProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategorySingleSelector({ selectedCategory, onCategoryChange }: CategorySingleSelectorProps) {
  const [open, setOpen] = useState(false);
  const { categories, isLoading } = useCategories();

  // Ensure categories is always an array
  const categoriesList = categories || [];
  
  const selectedCategoryName = categoriesList
    .find(cat => cat.id === selectedCategory)?.nome || '';

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className="w-full justify-between"
        disabled
      >
        Carregando categorias...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory ? selectedCategoryName : "Selecione uma categoria..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar categoria..." />
          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
          <CommandGroup>
            {categoriesList.map((category) => (
              <CommandItem
                key={category.id}
                onSelect={() => {
                  onCategoryChange(category.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCategory === category.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.nome}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
