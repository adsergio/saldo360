
import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategorySelector({ selectedCategories, onCategoriesChange }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const { categories, isLoading } = useCategories();

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  // Ensure categories is always an array
  const categoriesList = categories || [];
  
  const selectedCategoryNames = categoriesList
    .filter(cat => selectedCategories.includes(cat.id))
    .map(cat => cat.nome);

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
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length === 0 ? (
              "Selecione as categorias..."
            ) : (
              `${selectedCategories.length} categoria(s) selecionada(s)`
            )}
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
                  onSelect={() => handleCategoryToggle(category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCategoryNames.map((name) => (
            <Badge key={name} variant="secondary" className="text-xs">
              {name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
