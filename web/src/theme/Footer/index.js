import React from 'react';

import { useThemeConfig } from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';
import { useLocation } from 'react-router-dom'; // Import useLocation
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Footer() {
    const { footer } = useThemeConfig();
    const location = useLocation(); // Get the current URL pathname
    const { siteConfig } = useDocusaurusContext();

    if (location.pathname !== siteConfig.baseUrl || !footer) {
        return null; // Return IF NOT HOMEPAGE
    }
    const { copyright, links, logo, style } = footer;

    return (
        <FooterLayout
            style={style}
            links={links && links.length > 0 && <FooterLinks links={links} />}
            logo={logo && <FooterLogo logo={logo} />}
            copyright={copyright && <FooterCopyright copyright={copyright} />}
        />
    );
}

export default React.memo(Footer);
