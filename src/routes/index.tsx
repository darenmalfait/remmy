import * as path from 'path'

import * as React from 'react'
import {H1} from '@daren/ui-components'

import {Layout} from '../components/layout'
import {AddDestination} from '../components/modules/add-destination'
import {FileModule} from '../components/modules/file-module'
import {Section} from '../components/section'
import {useDestinations} from '../context/destinations-provider'
import {useFileUpload} from '../context/file-upload-provider'

const img = path.join(__dirname, 'assets/images', 'drag-to-icon.gif')

function IndexRoute() {
  const {addingFile, onFileRenamed} = useFileUpload()
  const {destinations} = useDestinations()

  return (
    <Layout>
      <Section>
        {destinations.length === 0 ? (
          <>
            <H1>Start by adding a destination</H1>
            <AddDestination />
          </>
        ) : (
          <>
            <H1>Add a file</H1>
            {addingFile ? (
              <FileModule file={addingFile} onDone={onFileRenamed} />
            ) : (
              <>
                <p>You can add a file by dragging in into the taskbar icon</p>
                <img
                  src={img}
                  className="w-full rounded-md shadow-outline"
                  alt="drag to icon"
                />
              </>
            )}
          </>
        )}
      </Section>
    </Layout>
  )
}

export {IndexRoute}
