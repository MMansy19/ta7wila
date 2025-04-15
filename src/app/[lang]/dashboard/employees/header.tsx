import { useTranslation } from "@/context/translation-context";

interface HeaderProps {
  totalEmployees: number;
  setShowAddModal: (show: boolean) => void;
}

const Header = ({ totalEmployees, setShowAddModal }: HeaderProps) => {
  const translations = useTranslation();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">{translations.sidebar.employees}</h2>
      <div className="flex flex-wrap gap-2 justify-end md:justify-start">
        <button className="bg-[#53B4AB] hover:bg-[#419189] text-black px-4 py-2 rounded-lg text-sm">
          {translations.employees.title}: {totalEmployees}
        </button>
        <button
          className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-lg text-sm"
          onClick={() => setShowAddModal(true)}
        >
          {translations.employees.addNew}
        </button>
      </div>
    </div>
  );
};

export default Header;