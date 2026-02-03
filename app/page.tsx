import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      {/* Colonne gauche */}
      <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
        {/* Vidéo - 2/3 hauteur */}
        <div className="bg-gray-200 rounded-lg flex-[2] min-h-0" />

        {/* Carte - 1/3 hauteur */}
        <div className="bg-gray-200 rounded-lg flex-1 min-h-0" />
      </div>

      {/* Chat - pleine hauteur droite */}
      <div className="min-h-0">
        <Chat />
      </div>
    </div>
  );
}
