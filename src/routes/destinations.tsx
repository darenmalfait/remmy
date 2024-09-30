import * as React from 'react'
import {
  Alert,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nerdfish/ui'
import {Trash} from 'lucide-react'

import {Layout} from '../components/layout'
import {AddDestination} from '../components/modules/add-destination'
import {Section} from '../components/section'
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
        <p className="text-primary text-sm font-medium">{destination.name}</p>
        <p className="text-secondary max-w-full truncate text-sm ">
          {destination.path}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {destination.isDefault ? (
          <Badge variant="success" className="cursor-pointer">
            default
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={setAsDefault}
          >
            set default
          </Badge>
        )}
        <button onClick={onDelete}>
          <Trash className="text-danger h-3 w-3" />
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
            <DialogTrigger asChild>
              <Button>Add first destination</Button>
            </DialogTrigger>
          </Section>
        ) : (
          <Section>
            <ul className="divide-y divide-gray-200">
              {destinations.map(destination => (
                <DestinationItem key={destination.id} {...destination} />
              ))}
            </ul>
            <DialogTrigger asChild>
              <Button>Add destination</Button>
            </DialogTrigger>
          </Section>
        )}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add destination path</DialogTitle>
          </DialogHeader>
          <AddDestination
            onSave={() => {
              setIsAdding(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export {DestinationsRoute}
