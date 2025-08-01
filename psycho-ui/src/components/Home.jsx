import Hero from "./HomePageAssets/Hero";
import Infos from "./HomePageAssets/Infos";

export default function Home(){
    return(
        <>
            <Hero
                title="Test psychotechnique AIR 2025"
                subtitle="Prêt à décoller ? Rejoignez-nous maintenant !" 
            />
            <Infos />
        </>
    );
}