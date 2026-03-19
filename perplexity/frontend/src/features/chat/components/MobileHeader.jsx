import { Menu, Edit } from 'lucide-react';

const MobileHeader = ({ setIsOpen }) => {
  return (
    <div className="md:hidden w-full flex items-center justify-between p-3 border-b border-white/10 bg-[#212121]">
      <button onClick={() => setIsOpen(true)} className="p-1">
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-medium">Cognivex</h1>
      <button className="p-1">
        <Edit size={20} />
      </button>
    </div>
  );
};

export default MobileHeader;