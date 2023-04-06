import * as React from 'react'
import {Alert, Button, Dialog} from '@nerdfish/ui'
import {Trash} from 'lucide-react'

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
          <Tag as="button" color="outline" onClick={setAsDefault}>
            set default
          </Tag>
        )}
        <button onClick={onDelete}>
          <Trash className="h-3 w-3 text-danger" />
        </button>
      </div>
    </li>
  )
}

function DestinationsRoute() {
  const {destinations} = useDestinations()
  const [isAdding, setIsAdding] = React.useState<boolean>(false)

  return (
    <Layout title="Destinations">
      <Dialog open={isAdding} onOpenChange={o => setIsAdding(o)}>
        {destinations.length === 0 ? (
          <Section>
            <Alert
              variant="warning"
              description="No destinations have yet been added. You can add destinations by clicking the button below."
            />
            <p>
              Destinations are the paths to where your documents get moved after
              renaming.
            </p>
            <Dialog.Trigger asChild>
              <Button>Add first destination</Button>
            </Dialog.Trigger>
          </Section>
        ) : (
          <Section>
            <ul className="divide-y divide-gray-200">
              {destinations.map(destination => (
                <DestinationItem key={destination.id} {...destination} />
              ))}
            </ul>
            <Dialog.Trigger asChild>
              <Button>Add destination</Button>
            </Dialog.Trigger>
          </Section>
        )}
        <Dialog.Content className="sm:max-w-[425px]">
          <Dialog.Header>
            <Dialog.Title>Add destination path</Dialog.Title>
          </Dialog.Header>
          <AddDestination
            onSave={() => {
              setIsAdding(false)
            }}
          />
        </Dialog.Content>
      </Dialog>
    </Layout>
  )
}

export {DestinationsRoute}
