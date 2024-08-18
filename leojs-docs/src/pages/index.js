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

const QuotesList = [
  {
    quote: 'I am using Leo since a few weeks and I brim over with enthusiasm for it. I think it is the most amazing software since the invention of the spreadsheet.',
    author: 'Anon'
  },
  {
    quote: 'We who use Leo know that it is a breakthrough tool and a whole new way of writing code.',
    author: 'Joe Orr'
  },
  {
    quote: 'I am a huge fan of Leo. I think it’s quite possibly the most revolutionary programming tool I have ever used and it (along with the Python language) has utterly changed my view of programming (indeed of writing) forever.',
    author: 'Shakeeb Alireza'
  },
  {
    quote: 'Thank you very much for Leo. I think my way of working with data will change forever… I am certain [Leo] will be a revolution. The revolution is as important as the change from sequential linear organization of a book into a web-like hyperlinked pages. The main concept that impress me is that the source listing isn’t the main focus any more. You focus on the non-linear, hierarchical, collapsible outline of the source code.',
    author: 'Korakot Chaovavanich'
  },
  {
    quote: 'Leo is a quantum leap for me in terms of how many projects I can manage and how much information I can find and organize and store in a useful way.',
    author: 'Dan Winkler'
  },
  {
    quote: 'Wow, wow, and wow…I finally understand how to use clones and I realized that this is exactly how I want to organize my information. Multiple views on my data, fully interlinkable just like my thoughts.',
    author: 'Anon'
  },
  {
    quote: 'Edward… you’ve come up with perhaps the most powerful new concept in code manipulation since VI and Emacs.',
    author: 'David McNab'
  },
  {
    quote: 'Leo is… a revolutionary step in the right direction for programming.',
    author: 'Brian Takita'
  },
  {
    quote: 'Thanks for a wonderful program - everybody should be using it! It blows the socks off that Java Mind mapping software that won project of the month a while back on sourceforge!',
    author: 'Derick van Niekerk'
  },
  {
    quote: 'What an original synthesis of different ideas, why can’t other Open Source projects change the way I think?',
    author: 'Anon'
  },
  {
    quote: 'When first I opened Leo, it was out of curiosity. But having used it…I’ll never go back. They’ll have to pry Leo out of my cold, dead fingers! Seriously, it should be renamed ‘Crack Cocaine’ because it’s that addictive. I’m ready to start a 12-Step group.',
    author: 'Travers A. Hough'
  },
  {
    quote: 'I feel addicted to programming again…in fact [Leo] has resurrected a dead project of mine :) The Outline has proven most liberating in terms of testing ideas out.',
    author: 'Anon'
  },
  {
    quote: 'I have been absolutely seduced by Leo over the past few days. I tell you, I can not put it down. I feel like a kid with a shiny new bike…I’m already bursting with new ways I’d like to use the tool in the future.',
    author: 'Lyn Adams Headley'
  },
  {
    quote: 'Thanks for the great work - I love Leo!!!',
    author: 'Josef Dalcolmo'
  },
  {
    quote: 'Leo has simplified updating and creating new scripts and .bats keeping similar information in the same place. there is almost an addictive withdrawal effect when I can complete an operation in so much less time with Leo & python than I had become used to.',
    author: 'Anon'
  },
  {
    quote: 'Leo should either replace or greatly augment the development tools that I use.',
    author: 'Zak Greant'
  },
  {
    quote: 'Leo is a marriage of outlining and programming. Pure genius. The main reason I am impressed with this tool is that it doesn’t affect your choice of tools. You can use whatever IDE for whatever language and switch back and forth between Leo and it.',
    author: 'Austin King'
  },
  {
    quote: 'Leo is the best IDE that I have had the pleasure to use. I have been using it now for about 2–3 months. It has totally changed not only the way that I program, but also the way that I store and organize all of the information that I need for the job that I do.',
    author: 'Ian Mulvany'
  },
  {
    quote: 'I only have one week of Leo experience but I already know it will be my default IDE/project manager…people complain about the lack of a project manager for the free/standard Python IDE’s like Idle. Leo clearly solves that problem and in a way that commercial tools can’t touch.',
    author: 'Marshall Parsons'
  },
  {
    quote: 'I have been using Leo for about 3 weeks and I hardly use my other programming editor anymore…I find it easy and enjoyable to use. I plan to adopt it as my presentation tool for code reviews.',
    author: 'Jim Vickroy'
  },
  {
    quote: 'I’m absolutely astounded by the power of such a simple idea! It works great and I can immediately see the benefits of using Leo in place of the standard flat file editor.',
    author: 'Tom Lee'
  },
  {
    quote: 'I think you’re really showing what open source can do and your current trajectory puts you on track to kick Emacs into the dustbin of computing history.',
    author: 'Dan Winkler'
  },
  {
    quote: 'Word outlines are very useful. But Leo makes Word look like a clunky toy.',
    author: 'Joe Orr'
  },
  {
    quote: 'Leo is an interactive editor for organizing text fragments hierarchically and sequentially into one or more files and hierarchical folders, without arbitrary limits on the number and size of text fragments and the depth of the hierarchy…',
    author: 'Alex Abacus'
  },
  {
    quote: 'Leo reminds me a great deal of things I loved when I used Userland’s Frontier (an outlining cms with a native oodb) - but Frontier wasn’t hackable enough for me, and it wasn’t oriented towards coding…, and you couldn’t round-trip rendered pages (big Leo win). This is really a super tool - in a matter of days I’ve started to use it on all my projects and I still haven’t figured out how I lived without it.',
    author: 'John Sequeira'
  },
  {
    quote: 'Leo is EXACTLY the kind of outliner I was looking for–fantastic job!',
    author: 'Steve Allen'
  },
  {
    quote: 'Leo creates living documents. Ideas can be organized and reorganized gradually and then inserted into the appropriate place in a project. Outlines become fluid, allowing infinite depth and by using clones of nodes, arbitrary levels of complexity…[Other] outliners impose structure on documents…Leo is different. Instead of imposing structure, it allows you to impose your own infrastructure, and then be as creative as you want. This brings the necessary chaos of creativity to heel when it is time to produce the document. The node structure creates ultimate flexibility when it comes to ordering scenes in chapter. Say good-bye to copy and paste and hello to drag and drop.',
    author: 'Chris George'
  },
  {
    quote: 'If you are like me, you have a kind of knowledge base with infos gathered over time. And you have projects, where you use some of those infos. Now, with conventional outliners you begin to double these infos, because you want to have the infos needed for the project with your project. With Leo you can do this too, but if you change text in one place IT IS UPDATED IN THE OTHER PLACE TOO! This is a feature I did not see with any other outliner (and I tried a few). Amazing! Leo directly supports the way I work!',
    author: 'F. Geiger'
  },
  {
    quote: 'Cloning is pure genius!… Leo’s cloning facility, allows me to create several views on the CFA course material. My main view follows the prescribed study guide. Another view is organized like the textbooks. Yet another gives me a glossary of terms. And when I’m done, I’ll have some nice libraries…I can re-use later in other projects.',
    author: 'Michael Manti'
  },
  {
    quote: 'A Leo file is an ideal documentation tool, collecting the assorted readme.txt files, the comments from the source files…as well as the config files themselves.',
    author: 'Kent Tenney'
  },
  {
    quote: 'Just as structured programming reveals and disciplines the flow control of a program, [Leo] allows the designer to reveal and discipline structure at many layers simultaneously: data structures, object structure, entity-relationship structure, client-server structure, design pattern structure, temporal structure, project management structure, and any other structure relevant to the system.',
    author: 'Steven P. Schaefer'
  },
  {
    quote: 'A funny observation with Leo is that when I ‘Leo-ise’ other people’s code, Leo makes the code’s structure so transparent that design faults become very quickly apparent. For example, maintenance pain caused by lack of factorization.',
    author: 'David McNab'
  },
  {
    quote: 'Leo is a powerful tool for organizing text into tree structures, and for just generally attacking a number of problems from a tree-based perspective.',
    author: 'Joe Orr'
  },
  {
    quote: 'The range of activities that Leo can support is amazingly wide. That’s why it’s hard to tell someone what Leo “is”. It’s like the elephant and the blind men - none of them can see the whole of the elephant.',
    author: 'Thomas Passin'
  }
];

function Quote({ quote, author }) {
  return (
    <li className={clsx(styles.customQuote)}>
      “{quote}” <span>—{author}</span>
    </li>
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
        <div className={clsx(styles.bulletsHolder)}>
          <ul className={clsx(styles.bullets)}>
            <li>An outliner. Everything in Leo is an outline.</li>
            <li>A data manager, and personal information manager.</li>
            <li>A powerful scripting environment.</li>
            <li>A tool for organizing and studying computer code.</li>
            <li>Extensible via a simple plugin architecture.</li>
          </ul>
        </div>
        <h3 className={clsx(styles.subtitle)}>
          Leo’s unique features
        </h3>
        <div className={clsx(styles.bulletsHolder)}>
          <ul className={clsx(styles.bullets)}>
            <li>Leo completely integrates JavaScript and outlines.</li>
            <li>Scripts have full access to Leo’s sources and VSCode’s API.</li>
            <li>Clones create multiple views of an outline.</li>
            <li>Leo’s clone-find commands enable the Leonine way to refactor.</li>
            <li>Scripts and programs can be composed from outlines.</li>
            <li>Importers convert flat text into outlines.</li>
            <li>@button scripts apply scripts to outline data.</li>
          </ul>
        </div>
        <h3 className={clsx(styles.subtitle)}>
          What People are Saying about Leo
        </h3>
        <div className="container">
          <div className={clsx(styles.bulletsHolder)}>
            <ul className={clsx(styles.bullets)}>
              {QuotesList.map((props, idx) => (
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

