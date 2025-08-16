import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import SplitText from "./components/SplitText"
import Lanyard from './components/Lanyard'
import MagicBento from './components/MagicBento'
import ScrollVelocity from './components/ScrollVelocity'
import ScrambledText from './components/ScrambledText'
import LetterGlitch from './components/LetterGlitch'
import SkillsMarquee from './components/SkillsMarquee'
import Ballpit from './components/Ballpit'
import Orb  from './components/Orb'
import PixelCard from './components/PixelCard'
import Masonry from './components/Masonry';
import CircularGallery from './components/CircularGallery'
import Projects from './components/Projects'
import Contact from './components/Contact'

const items = [
    {
      id: "1",
      img: "https://picsum.photos/id/1015/600/900?grayscale",
      url: "https://example.com/one",
      height: 400,
    },
    {
      id: "2",
      img: "https://picsum.photos/id/1011/600/750?grayscale",
      url: "https://example.com/two",
      height: 250,
    },
    {
      id: "3",
      img: "https://picsum.photos/id/1020/600/800?grayscale",
      url: "https://example.com/three",
      height: 600,
    },
    {
      id: "4",
      img: "https://picsum.photos/id/1025/600/900?grayscale",
      url: "https://example.com/four",
      height: 400,
    },
    {
      id: "5",
      img: "https://picsum.photos/id/1030/600/900?grayscale",
      url: "https://example.com/five",
      height: 400,
    },
    {
      id: "6",
      img: "https://picsum.photos/id/1035/600/900?grayscale",
      url: "https://example.com/six",
      height: 400,
    },
    {
      id: "7",
      img: "https://picsum.photos/id/1040/600/900?grayscale",
      url: "https://example.com/seven",
      height: 400,
    },
    {
      id: "8",
      img: "https://picsum.photos/id/1045/600/900?grayscale",
      url: "https://example.com/eight",
      height: 400,
    },
    {
      id: "9",
      img: "https://picsum.photos/id/1050/600/900?grayscale",
      url: "https://example.com/nine",
      height: 400,
    },
    // ... more items
];

function App() {
  const [count, setCount] = useState(0)

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <section id="home" className="section">
          <div>
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
          </div>
        </section>

<section id="about" className="py-6 md:py-8 border-b border-white/10 w-full overflow-x-hidden">
  <div className="mx-auto max-w-7xl px-4 lg:px-6 w-full">
    {/* Heading aligns with grid because it's inside the same container */}
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight py-2">
      Hi there 👋
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-y-0 lg:gap-x-16 items-start lg:items-center w-full">
      {/* LEFT: compact ScrambledText, no extra padding */}
      <div className="lg:col-span-6 w-full">
        <div className="max-w-xl w-full">
          <ScrambledText
            className="scrambled-text-demo text-left text-base md:text-lg leading-snug"
            radius={100}
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
          >
            I'm Swapnil, a senior CS student at NJIT building fast, scalable, and impactful software.
            From Automation pipelines and DevOps integrations to AI-powered apps, I turn complex ideas into reliable products.
            I focus on performance, automation, and clean design that delivers real-world results.
          </ScrambledText>
        </div>
      </div>

      {/* RIGHT: LetterGlitch panel — consistent sizing, no inner padding */}
      <div className="lg:col-span-6 w-full">
        <div className="relative w-full max-w-2xl lg:max-w-none overflow-hidden">
          {/* choose ONE sizing approach; aspect keeps it neat */}
          <div className="aspect-[16/10] md:aspect-[16/9] w-full">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
            />
          </div>
          {/*
          // Or fixed height if you prefer:
          // <div className="h-56 md:h-64">
          //   <LetterGlitch ... />
          // </div>
          */}
        </div>
      </div>
    </div>
    <div className="w-full overflow-x-hidden">
      <SkillsMarquee />
    </div>
  </div>
</section>



        <section id="projects" className="section">
          {/* <div 
          style={{position: 'relative', overflow: 'hidden', minHeight: '800px', maxHeight: '500px', width: '100%'}}>
            <Ballpit
              count={100}
              gravity={0.01}
              friction={0.9975}
              wallBounce={0.95}
              followCursor={true}
            />
          </div> */}
          {/* <div className='flex flex-wrap gap-6 justify-center items-center'>
          <PixelCard variant="default">
            // your card content (use position: absolute)
          </PixelCard>
          <PixelCard variant="default">
            // your card content (use position: absolute)
          </PixelCard>
          <PixelCard variant="default">
            // your card content (use position: absolute)
          </PixelCard>
          </div> */}
        {/* <div 
        className='w-full'
        style={{ height: '600px', position: 'relative' }}>
          <CircularGallery 
            items={[
              { image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop", text: "Project 1" },
              { image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop", text: "Project 2" },
              { image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop", text: "Project 3" },
              { image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?w=800&h=600&fit=crop", text: "Project 4" },
              { image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=600&fit=crop", text: "Project 5" },
              { image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop", text: "Project 6" }
            ]}
            bend={3} 
            textColor="#ffffff" 
            borderRadius={0.05} 
            scrollEase={0.02}
            scrollSpeed={2}
          /> 
        </div> */}
        <Projects />

        </section>

        <section id="contact" className="section">
          {/* <div className="section-content">
            <h1>Contact</h1>
            <p>Get in touch with me...</p>
            <div className="contact-info">
              <p>Email: swa2314@gmail.com</p>
              <p>Phone: +1 (862) 385-5820</p>
            </div>
          </div> */}

          <Contact /> 
        </section>
      </main>
    </div>
  )
}

export default App


