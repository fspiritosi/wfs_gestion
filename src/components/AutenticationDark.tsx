import Image from 'next/image';
import Link from 'next/link';

function AutenticationDark() {
  return (
    <div className="dark:z-40 hidden flex-col p-10 lg:flex dark:border-r min-h-screen text-black dark:bg-primary">
      <div className="absolute border-r-secondary/30 border-r top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,204,0.5),rgba(31,45,92,0.3))]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-secondary/20 to-transparent"></div>
      <Link className="relative z-20 flex items-center font-bold text-2xl text-primary dark:text-white" href="/">
        <Image
          src="/logo_WFS_SP_color.png"
          alt="Logo de WFS"
          className="size-12 mr-4 relative z-40"
          width={120}
          height={120}
        />
        WFS
      </Link>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2 p-6 rounded-lg bg-primary/60 border-l-4 border-secondary shadow-sm">
          <p className="text-xl text-pretty dark:text-white">
            Combinamos control de procesos, desarrollo de software y consultoría organizacional para ofrecerte
            soluciones integrales que generan resultados reales.
          </p>
          <footer className="text-md dark:text-secondary font-bold">WFS</footer>
        </blockquote>
      </div>
    </div>
  );
}

export default AutenticationDark;
