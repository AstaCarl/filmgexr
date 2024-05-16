import Loader from '@/components/Loader';
import { fetcher } from '../../lib/api';
import React, { useState, useEffect, useContext } from 'react';
import { LoaderContext } from '../contexts/LoaderContext';
import StudioModels from '@/components/StudioModels';
import ImgWithParagraf from '@/components/ImgWithParagraf';
import TitleWithParagraf from '@/components/TitleWithParagraf';
import CookieBanner from '@/components/CookieBanner';
import Title from '@/components/ui/Title';
import { useIntersectionObserver } from '../../lib/interSectionObserver';
import Anchor from '@/components/ui/Anchor';
import Image from 'next/image';
import ClientsBanner from '@/components/ClientsBanner';
import Facilities from '@/components/Facilities';
import HeroSection from '@/components/HeroSection';

export async function getStaticProps() {
  const response = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/home-page?populate=introduction,clients.logos,arrowAnchor.icon,benefits.image,HeroVideo,Studios.studios,uniqueInScandinavia.bulletpoints,fullService.bulletpoints,virtualProduction.bulletpoints`
  );
  const homeData = response.data.attributes;
  return {
    props: {
      homeData: homeData,
    },
  };
}

export default function Home({ homeData }) {
  const { hasLoaded, setHasLoaded } = useContext(LoaderContext);
  const [introData, setIntroData] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isClientsVisible, setIsClientsVisible] = useState(false);
  const [isBenefitsVisible, setIsBenefitsVisible] = useState(false);

  const ref = useIntersectionObserver(() => {
    setIsVisible(true);
  });

  const clientsRef = useIntersectionObserver(() => {
    setIsClientsVisible(true);
  });

  const benefitsRef = useIntersectionObserver(() => {
    setIsBenefitsVisible(true);
  });

  useEffect(() => {
    if (homeData && homeData.arrowAnchor && homeData.arrowAnchor.icon && homeData.clients) {
      setIntroData(homeData);
    }

    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 4200);

    return () => {
      clearTimeout(timer);
      setIntroData(null);
    };
  }, [setHasLoaded, homeData]);

  const mobileSrc = homeData.HeroVideo.data[0].attributes.url;
  const desktopSrc = homeData.HeroVideo.data[1].attributes.url;

  if (!hasLoaded) {
    return <Loader />;
  } else {
    return (
      <main className={`transition-opacity ease-in duration-300 relative z-0 bg-off-white`}>
        <CookieBanner />
        <div>
          <HeroSection mobileSrc={mobileSrc} desktopSrc={desktopSrc} />
          <div id="firstSection" className="fullscreen flex-col justify-center page-content-container">
            {introData &&
              introData.arrowAnchor &&
              introData.arrowAnchor.icon &&
              introData.arrowAnchor.icon.data &&
              introData.arrowAnchor.icon.data.attributes && (
                <>
                  <TitleWithParagraf
                    variant="pageTitle"
                    introData={introData}
                    subtitle={introData.introduction.subtitle}
                    title={introData.introduction.title}
                    paragraf={introData.introduction.paragraf}
                  />
                  <div
                    ref={ref}
                    className={`${
                      isVisible ? ' appear-on-scroll delay-300' : 'before-scroll translate-y-4'
                    } v-space-xl flex justify-start gap-2 w-full`}
                  >
                    <Anchor variant="arrowLink" href={introData.arrowAnchor.url} title={introData.arrowAnchor.title} />
                    <Image
                      src={introData.arrowAnchor.icon.data.attributes.url}
                      alt={introData.arrowAnchor.icon.data.attributes.alternativeText}
                      width={40}
                      height={40}
                      className="h-auto w-auto"
                    />
                  </div>
                </>
              )}
          </div>
          <div
            ref={clientsRef}
            className={`pb-36 bg-off-white ${isClientsVisible ? ' appear-on-scroll' : 'before-scroll translate-y-4'} `}
          >
            <ClientsBanner clientData={introData} />
          </div>
          <div>
            <div
              ref={benefitsRef}
              className={`${
                isBenefitsVisible ? ' appear-on-scroll' : 'before-scroll translate-y-4'
              } page-content-container`}
            >
              <Title title={introData.benefitsTitle} variant="pageTitle" />
            </div>
            <div className="">
              {introData.benefits &&
                introData.benefits.map((benefit, index) => (
                  <div key={index} className="pb-36 bg-of-white sticky top-[20%] lg:top-[25%] scroll-smooth ">
                    <ImgWithParagraf
                      paragrafText={benefit.paragraf}
                      title={benefit.subtitle}
                      src={benefit.image.data.attributes.url}
                      alt={benefit.image.data.attributes.alternativeText}
                    />
                    {introData &&
                      introData.arrowAnchor &&
                      introData.arrowAnchor.icon &&
                      introData.arrowAnchor.icon.data &&
                      introData.arrowAnchor.icon.data.attributes &&
                      index === introData.benefits.length - 1 && (
                        <div className="hidden lg:flex w-full gap-2 page-content-container">
                          <Anchor
                            variant="arrowLink"
                            href={introData.arrowAnchor.url}
                            title={introData.arrowAnchor.title}
                          />
                          <Image
                            src={introData.arrowAnchor.icon.data.attributes.url}
                            alt={introData.arrowAnchor.icon.data.attributes.alternativeText}
                            width={40}
                            height={40}
                            className="h-auto w-auto"
                          />
                        </div>
                      )}
                  </div>
                ))}
            </div>
            <div className=" v-space-xl relative bg-off-white">
              <StudioModels studioData={homeData.Studios} />
            </div>
          </div>
        </div>
        <Facilities
          uniqueData={introData.uniqueInScandinavia}
          serviceData={introData.fullService}
          productionData={introData.virtualProduction}
          title={introData.bulletsTitle}
        />
      </main>
    );
  }
}
