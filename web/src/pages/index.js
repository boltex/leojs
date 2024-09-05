//@+leo-ver=5-thin
//@+node:felix.20240816231257.1: * @file  src/pages/index.js
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

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
          <i>‟Leo is a fundamentally different way of organizing data, programs and scripts.”</i><br></br><span className={clsx(styles.homeQuote)}>LeoJS is a JavaScript implementation designed as an extension for VSCode.</span>
        </h3>
        <HomepageFeatures />
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
              <ReactPlayer className="customPlayer1" light playing width="440px" height="247px" url='https://www.youtube.com/watch?v=j0eo7SlnnSY' />
            </div>

          </div>
        </div>
        <div className="container">
          <div className="row margin-bottom--md">
            <div className={clsx('col col--6')}>
              <ReactPlayer className="customPlayer2" light playing width="440px" height="247px" url='https://www.youtube.com/watch?v=M_mKXSbVGdE' />
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
        <h3 className={clsx(styles.subtitle)}>
          VSCode UI Integration
        </h3>
        <div className="container">
          <div className="row margin-bottom--md">
            <div className={clsx('col col--12')}>
              <div className={clsx(styles.bulletsHolder)}>
                <ul className={clsx(styles.bullets)}>
                  <li>UI controls such as a <strong>Leo Outline</strong> in the explorer view, and as a standalone sidebar, <strong>body pane</strong>, <strong>opened documents selector</strong> along with a <strong>Log Window</strong> <a href="https://code.visualstudio.com/api/extension-capabilities/common-capabilities#output-channel" rel="nofollow">output channel</a>.</li>
                  <li><strong>Detached Body Panes</strong>, independent of the selected node, can be opened with the 'Open Aside' command.</li>
                  <li>Keybindings that match those of the Leo editor, including arrow keys behavior for outline keyboard navigation. (Can be turned off with the <strong>'Leo Tree Browsing'</strong> option setting)</li>
                  <li><strong>Derived files change detection</strong>. See <a href="#derive-external-files-">External Files</a> below for more details</li>
                  <li><strong>Scriptable in Javascript and Typescript</strong>. All commands and scripts have easy access to outline structure via a simple Javascript API</li>
                  <li><strong>'@button' panel</strong> for <a href="https://leo-editor.github.io/leo-editor/tutorial-tips.html#use-button-nodes" rel="nofollow">creating your own commands with @buttons</a></li>
                  <li><strong>Find panel</strong> that reacts to Leo's typical keybindings, Ctrl+F, F2, F3... when focus is in the outline or body pane</li>
                  <li><strong>Nav and Tag panel</strong> search controls are integrated in the Find panel</li>
                  <li><strong>Undo History panel</strong>, showing all actions and allowing going back, or forward, to any undo states.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <h3 className={clsx(styles.subtitle)}>
          Leo Commands
        </h3>
        <div className="container">
          <div className="row margin-bottom--md">
            <div className={clsx('col col--12')}>
              <p>LeoJS offers an extensive set of integrated commands, accessible through a variety of interfaces — toolbar buttons, dedicated menus, and intuitive keybindings. Those commands are also discoverable via the Visual Studio Code Command Palette. (accessible through F1 or Ctrl+Shift+P)</p>
            </div>
          </div>
        </div>
        <h3 className={clsx(styles.subtitle)}>
          Context-Aware Keybindings
        </h3>
        <div className="container">
          <div className="row margin-bottom--md">
            <div className={clsx('col col--12')}>
              <p>The keybinding architecture is designed to be context-aware. When your focus is within the LeoJS Body or Outline pane, LeoJS-specific keybindings take precedence. Shift your focus outside these panes, and Visual Studio Code's native keybindings resume control.</p>
            </div>
          </div>
        </div>
        <h3 className={clsx(styles.subtitle)}>
          The Minibuffer
        </h3>
        <div className="container">
          <div className="row margin-bottom--md">
            <div className={clsx('col col--12')}>
              <p>For those familiar with Leo, the 'minibuffer' serves as the nerve center for command execution. Access it through Alt+X and use the complete set of Leo's commands!</p>
            </div>
          </div>
        </div>
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

