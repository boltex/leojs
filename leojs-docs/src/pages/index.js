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
            to="/docs/getting-started/leo-in-10-minutes">
            Leo in 10 Minutes ⏱️
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
      description="The literate editor with outline JavaScript implementation">
      <HomepageHeader />
      <main>
        <h3 className={clsx(styles.subtitle)}>
          <i>‟Leo is a fundamentally different way of organizing data, programs and scripts.”</i><br></br>LeoJS is a JavaScript implementation designed as an extension for VSCode.
        </h3>
        <HomepageFeatures />
        <h3 className={clsx(styles.subtitle)}>
          Leo is:
        </h3>
        <p className={clsx(styles.bulletsHolder)}>
          <ul className={clsx(styles.bullets)}>
            <li>An outliner. Everything in Leo is an outline.</li>
            <li>A data manager, and personal information manager.</li>
            <li>A powerful scripting environment.</li>
            <li>A tool for organizing and studying computer code.</li>
            <li>Extensible via a simple plugin architecture.</li>
          </ul>
        </p>
        <h3 className={clsx(styles.subtitle)}>
          Leo’s unique features
        </h3>
        <p className={clsx(styles.bulletsHolder)}>
          <ul className={clsx(styles.bullets)}>
            <li>Leo completely integrates JavaScript and outlines.</li>
            <li>Scripts have full access to Leo’s sources and VSCode’s API.</li>
            <li>Clones create multiple views of an outline.</li>
            <li>Leo’s clone-find commands enable the Leonine way to refactor.</li>
            <li>Scripts and programs can be composed from outlines.</li>
            <li>Importers convert flat text into outlines.</li>
            <li>@button scripts apply scripts to outline data.</li>
          </ul>
        </p>
      </main>
    </Layout>
  );
}
//@-leo
