//@+leo-ver=5-thin
//@+node:felix.20240816230707.2: * @file leojs-docs/src/components/HomepageFeatures/index.js
//@+others
//@+node:felix.20240816230707.3: ** function Feature
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Directed Acyclic Graphs',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Break down your code into a structured outline that generates or parses back your source files.
      </>
    ),
  },
  {
    title: 'Web-Based Development',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        LeoJS can be run as a web extension on VSCode for the web. It works directly inside GitHub and Azure Repos.
      </>
    ),
  },
  {
    title: 'Scriptable in JavaScript',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Scriptable in Javascript and Typescript, all commands and scripts have access to outline structure.
      </>
    ),
  },

];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}
//@-others
export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
//@@language javascript
//@@tabwidth -4
//@-leo
