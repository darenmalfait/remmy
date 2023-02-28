import * as React from 'react'
import {Button, H2} from '@daren/ui-components'
import {shell} from 'electron'

import {Section} from '../section'

function About() {
  const navigateTo = React.useCallback(async src => {
    await shell.openExternal(src)
  }, [])

  return (
    <Section>
      <H2>About Remmy</H2>
      <p>
        Remmy is a simple file manager that allows you to move files from one
        location to another, renaming them in the process.
      </p>
      <ul>
        <li>
          Created by
          <Button variant="link" onClick={() => navigateTo('https://daren.be')}>
            Daren Malfait BV
          </Button>
        </li>
        <li>
          Follow me on{' '}
          <Button
            variant="link"
            onClick={() => navigateTo('https://twitter.com/darenmalfait')}
          >
            Twitter
          </Button>
        </li>
      </ul>
    </Section>
  )
}

export {About}
