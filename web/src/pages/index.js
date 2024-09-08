//@+leo-ver=5-thin
//@+node:felix.20240816231257.1: * @file  src/pages/index.js
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

import BrowserOnly from '@docusaurus/BrowserOnly';
import ReactPlayer from 'react-player/youtube';

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
            to="/docs/getting-started/tutorial-basics">
            Leo in 10 Minutes ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function Quote({ quote, author }) {
  return (
    <li className={clsx(styles.customQuote)}>
      “{quote}” <span>—{author}</span>
    </li>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const otherQuotes = siteConfig.customFields.quotesList;

  return (
    <Layout
      title={`Leo Editor for VSCode`}
      description="The literate editor with outline JavaScript implementation">
      <HomepageHeader />
      <main>
        <h3 className={clsx(styles.subtitle)}>
          <i>‟Leo is a fundamentally different way of organizing data, programs and scripts.”</i><br></br>
          <span className={clsx(styles.homeQuote)}>LeoJS is a JavaScript implementation designed as an extension for VSCode.</span>
        </h3>

        <HomepageFeatures featureId="0" />

        <div className="container">
          <div className="row margin-bottom--md margin-top--md">
            <div className={clsx('col col--6')}>
              <h3 className={clsx(styles.subtitle)}>
                Leo is:
              </h3>
              <div className={clsx(styles.bulletsHolder)}>
                <ul className={clsx(styles.bullets)}>
                  <li>An outliner. Everything in Leo is an outline.</li>
                  <li>A data manager, and personal information manager.</li>
                  <li>A powerful scripting environment.</li>
                  <li>A tool for organizing and studying computer code.</li>
                  <li>Extensible via a simple plugin architecture.</li>
                </ul>
              </div>
            </div>
            <div className={clsx('col col--6')}>
              <BrowserOnly fallback={<div>Loading...</div>}>
                {() => {
                  // const LibComponent =
                  //   require('some-lib-that-accesses-window').LibComponent;
                  // return <LibComponent {...props} />;
                  return <ReactPlayer className="customPlayer1" light playing width="100%" height="250px" url='https://www.youtube.com/watch?v=j0eo7SlnnSY' />
                }}
              </BrowserOnly>
            </div>
          </div>
        </div>

        <div className={clsx(styles.puckBg, "container")}>
          <h3 className={clsx(styles.subtitle)}>
            VSCode UI Integration
          </h3>
          <div className="row">
            <div className={clsx('col col--12')}>
              <div className={clsx(styles.bulletsHolder)}>
                <ul className={clsx(styles.bullets)}>
                  <li><strong>Outline</strong> in the explorer view, and in its own sidebar</li>
                  <li><strong>body pane</strong> and <strong>Detached Body Panes</strong></li>
                  <li><strong>Keybindings</strong> that match the original Leo editor</li>
                  <li><strong>Find panel,</strong> with integrated <strong>Nav and Tag panel</strong></li>
                  <li><strong>'@button' panel</strong></li>
                  <li><strong>Undo History panel</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row margin-bottom--md">
            <div className={clsx('col col--6')}>
              <BrowserOnly fallback={<div>Loading...</div>}>
                {() => {
                  // const LibComponent =
                  //   require('some-lib-that-accesses-window').LibComponent;
                  // return <LibComponent {...props} />;
                  return <ReactPlayer className="customPlayer2" light playing width="100%" height="250px" url='https://www.youtube.com/watch?v=M_mKXSbVGdE' />
                }}
              </BrowserOnly>
            </div>
            <div className={clsx('col col--6')}>
              <h3 className={clsx(styles.subtitle)}>
                Leo’s unique features
              </h3>
              <div className={clsx(styles.bulletsHolder)}>
                <ul className={clsx(styles.bullets)}>
                  <li>Scripts have full access to Leo’s sources and VSCode’s API.</li>
                  <li>Clones create multiple views of an outline.</li>
                  <li>Leo’s clone-find commands enable the Leonine way to refactor.</li>
                  <li>Scripts and programs can be composed from outlines.</li>
                  <li>Importers convert flat text into outlines.</li>
                  <li>@button scripts apply scripts to outline data.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <HomepageFeatures featureId="1" />

        <h3 className={clsx(styles.subtitle)}>
          What People are Saying about Leo
        </h3>
        <div className="container">
          <div className={clsx(styles.bulletsHolder)}>
            <ul className={clsx(styles.bullets)}>
              {otherQuotes.map((props, idx) => (
                <Quote key={idx} {...props} />
              ))}
            </ul>
          </div>
        </div>

      </main>
    </Layout>
  );
}
//@@last
//@-leo

