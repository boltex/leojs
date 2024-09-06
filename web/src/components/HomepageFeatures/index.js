//@+leo-ver=5-thin
//@+node:felix.20240816230707.2: * @file src/components/HomepageFeatures/index.js
//@+others
//@+node:felix.20240816230707.3: ** function Feature
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [[
  {
    title: 'Directed Acyclic Graphs',
    Svg: require('@site/static/img/acyclic-graph.svg').default,
    description: (
      <>
        Break down your code into a structured outline that generates or parses back your source files.
      </>
    ),
  },
  {
    title: 'Web-Based Development',
    Svg: require('@site/static/img/web-graph.svg').default,
    description: (
      <>
        LeoJS can also run as a web extension on VSCode for the web. It works directly inside GitHub and Azure Repos.
      </>
    ),
  },
  {
    title: 'Scriptable in JavaScript',
    Svg: require('@site/static/img/js-ts-graph.svg').default,
    description: (
      <>
        Scriptable in Javascript and Typescript, all commands and scripts have access to outline structure.
      </>
    ),
  },
],
[
  {
    title: 'Leo Commands',
    Svg: require('@site/static/img/leoCommands.svg').default,
    description: (
      <>
        Extensive set of integrated commands with toolbar buttons, menus, and keybindings. They are also discoverable in VSCode's Command Palette.
      </>
    ),
  },
  {
    title: 'Context-Aware Keybindings',
    Svg: require('@site/static/img/keycap2.svg').default,
    description: (
      <>
        The keybindings are context-aware. When your focus is within the Body or Outline pane, Leo-specific keybindings take precedence.
      </>
    ),
  },
  {
    title: 'The Minibuffer',
    Svg: require('@site/static/img/minibuffer.svg').default,
    description: (
      <>
        The 'minibuffer' is the command execution hub. Access it through Alt+X and use the <i>complete set</i> of Leo commands!
      </>
    ),
  },
]
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      {Svg && <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>}
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}
//@-others
export default function HomepageFeatures({ featureId }) {
  let featuresShown = FeatureList[featureId]
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {featuresShown.map((props, idx) => (
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
