import { Button, buttonVariants } from "@/components/ui/button"
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 m-0 -z-10 bg-[url('/banner.jpg')] bg-cover bg-center" />

      <div className="h-full">
        <div className="flex flex-col gap-y-16 justify-center h-[85vh] items-center">
          <div className="text-center lg:text-left md:text-9xl tracking-tight flex flex-col w-[80%] max-w-[400px] md:max-w-[800px]">
            <h1 style={{ animationDelay: "0ms" }} className="animate-pop-in font-bold text-left text-2xl md:text-4xl w-full text-white">Wilson's {new Date().getFullYear()}</h1>
            <h1 style={{ animationDelay: "100ms" }} className="animate-pop-in font-black text-left w-full text-white text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]">Grad</h1>
            <h1 style={{ animationDelay: "300ms" }} className="animate-pop-in font-black text-right sm:text-right w-full text-white text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]">Social</h1>
          </div>
          <div style={{ animationDelay: "700ms" }} className="animate-pop-in">
            <Link href="/dashboard" className={cn(buttonVariants({ variant: "default", size: "lg" }), "font-extrabold text-[#3f51b5] bg-white hover:bg-white/80 text-left text-xl transition hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/5")}>Book Your Seat <ArrowRight /></Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-pop-in {
          transform-origin: center center;
          opacity: 0;
          transform: scale(0);
          animation: popIn 0.4s ease-out forwards;
        }`
      }</style>
    </>
  )
}