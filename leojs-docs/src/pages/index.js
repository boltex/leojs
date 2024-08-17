//@+leo-ver=5-thin
//@+node:felix.20240816231257.1: * @file  leojs-docs/src/pages/index.js
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner, styles.customHero)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            LeoJS Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Leo Editor for VSCode`}
      description="The literate editor with outline javaScript implementation">
      <HomepageHeader />
      <main>
        <h3 className={clsx(styles.subtitle)}>
          <i>‟Leo is a fundamentally different way of organizing data, programs and scripts.”</i><br></br>LeoJS is a JavaScript implementation designed as an extension for VSCode.
        </h3>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
//@-leo
