import Navigation from '../components/Navigation';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import { fetcher } from '../../lib/api';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [navigationData, setNavigationData] = useState([]);

  const [footerData, setFooterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const router = useRouter();
  useEffect(() => {
    const fetchNavigationData = async () => {
      setIsLoading(true);
      try {
        const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/header?populate=logo.logo,navLink`);
        const navData = await response;
        setNavigationData(navData.data.attributes);

        const footerResponse = await fetcher(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/footer?populate=footerLink,logo,socials.icon`
        );
        const footerData = await footerResponse;
        setFooterData(footerData.data.attributes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };
    fetchNavigationData();
  }, []);

  if (isLoading) {
    return <div className=""></div>;
  }
  return (
    <div className="bg-off-white h-screen relative z-0">
      <Navigation navigationData={navigationData} />
      <main className="">{children}</main>
      <Footer footerData={footerData} />
    </div>
  );
}
