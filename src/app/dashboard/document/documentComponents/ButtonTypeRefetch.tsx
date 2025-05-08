"use client"
import { Button } from '@/components/ui/button';
import { useCountriesStore } from '@/store/countries';
import { useLoggedUserStore } from '@/store/loggedUser';

function ButtonTypeRefetch() {
  const fetchDocumentTypes = useCountriesStore((state) => state.documentTypes);
  const actualCompany = useLoggedUserStore((state) => state.actualCompany);
  return (
    <Button
      onClick={() => {
        document.getElementById('create_new_document')?.click();
        fetchDocumentTypes(actualCompany?.id);
      }}
    >
      Crear documento
    </Button>
  );
}

export default ButtonTypeRefetch;
