import * as React from 'react'
import {Alert, Button, Modal} from '@daren/ui-components'
import {TrashIcon} from '@heroicons/react/24/solid'

import {Layout} from '../components/layout'
import {AddDestination} from '../components/modules/add-destination'
import {Section} from '../components/section'
import {Tag} from '../components/tag'
import {Destination, useDestinations} from '../context/destinations-provider'

function DestinationItem(destination: Destination) {
  const {removeDestination, setDefaultDestination} = useDestinations()

  function onDelete() {
    removeDestination(destination.id)
  }

  function setAsDefault() {
    setDefaultDestination(destination.id)
  }

  return (
    <li
      key={destination.id}
      className="flex max-w-full justify-between space-x-4 py-4"
    >
      <div className="flex max-w-[300px] flex-col">
        <p className="text-sm font-medium text-primary">{destination.name}</p>
        <p className="max-w-full truncate text-sm text-secondary ">
          {destination.path}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {destination.isDefault ? (
          <Tag color="success">default</Tag>
        ) : (
          <Tag as="button" color="default" onClick={setAsDefault}>
            set default
          </Tag>
        )}
        <button onClick={onDelete}>
          <TrashIcon className="h-3 w-3 text-danger" />
        </button>
      </div>
    </li>
  )
}

function DestinationsRoute() {
  const {destinations} = useDestinations()
  const [adding, setAdding] = React.useState<boolean>(false)

  return (
    <Layout title="Destinations">
      {adding ? (
        <Modal
          type="neutral"
          description={<AddDestination onSave={() => setAdding(false)} />}
          open={adding}
          onClose={() => setAdding(false)}
        />
      ) : null}
      {destinations.length === 0 ? (
        <Section>
          <Alert
            type="warning"
            description="No destinations have yet been added. You can add destinations by clicking the button below."
          />
          <p>
            Destinations are the paths to where your documents get moved after
            renaming.
          </p>
          <Button onClick={() => setAdding(true)}>Add first destination</Button>
        </Section>
      ) : (
        <Section>
          <h2 className="text-lg font-semibold">Current destinations</h2>
          <ul className="divide-y divide-gray-200">
            {destinations.map(destination => (
              <DestinationItem key={destination.id} {...destination} />
            ))}
          </ul>
          <Button onClick={() => setAdding(true)}>Add destination</Button>
        </Section>
      )}
    </Layout>
  )
}

export {DestinationsRoute}
