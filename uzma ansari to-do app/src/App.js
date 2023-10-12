// App.js
import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from '@mantine/core'
import { MoonStars, Sun, Trash } from 'tabler-icons-react'

import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'

import './App.css'

import User from './User' // Import the User component

export default function App() {
  const [tasks, setTasks] = useState([])
  const [opened, setOpened] = useState(false)
  const [user, setUser] = useState(null) // Store user info

  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })
  const toggleColorScheme = value =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys('mod+J', () => toggleColorScheme())

  const taskTitle = useRef('')
  const taskSummary = useRef('')

  function createTask() {
    if (user) {
      setTasks([
        ...tasks,
        {
          user: user.name,
          title: taskTitle.current.value,
          summary: taskSummary.current.value,
        },
      ])

      saveTasks([
        ...tasks,
        {
          user: user.name,
          title: taskTitle.current.value,
          summary: taskSummary.current.value,
        },
      ])
    } else {
      alert('Please submit your user info first.')
    }
  }

  function deleteTask(index) {
    var clonedTasks = [...tasks]
    clonedTasks.splice(index, 1)
    setTasks(clonedTasks)
    saveTasks([...clonedTasks])
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem('tasks')
    let tasks = JSON.parse(loadedTasks)

    if (tasks) {
      setTasks(tasks)
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: 'md' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <User onUserSubmit={setUser} /> {/* Render the User component */}
          {user && (
            <h3>
              Welcome, {user.name} ({user.age} years old)
            </h3>
          )}
          <Modal
            opened={opened}
            size={'md'}
            title={'New Task'}
            withCloseButton={false}
            onClose={() => {
              setOpened(false)
            }}
            centered
          >
            <TextInput
              mt={'md'}
              ref={taskTitle}
              placeholder={'Task Title'}
              required
              label={'Title'}
            />
            <TextInput
              ref={taskSummary}
              mt={'md'}
              placeholder={'Task Summary'}
              label={'Summary'}
            />
            <Group mt={'md'} position={'apart'}>
              <Button
                onClick={() => {
                  setOpened(false)
                }}
                variant={'subtle'}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask()
                  setOpened(false)
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={'apart'}>
              <Title
                sx={theme => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={'blue'}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === 'dark' ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks
                .filter(task => !user || task.user === user.name) // Filter tasks by user's name
                .map((task, index) => {
                  if (task.title) {
                    return (
                      <Card withBorder key={index} mt={'sm'}>
                        <Group position={'apart'}>
                          <Text weight={'bold'}>{task.title}</Text>
                          <ActionIcon
                            onClick={() => {
                              deleteTask(index)
                            }}
                            color={'red'}
                            variant={'transparent'}
                          >
                            <Trash />
                          </ActionIcon>
                        </Group>
                        <Text color={'dimmed'} size={'md'} mt={'sm'}>
                          {task.summary
                            ? task.summary
                            : 'No summary was provided for this task'}
                        </Text>
                      </Card>
                    )
                  }
                })
            ) : (
              <Text size={'lg'} mt={'md'} color={'dimmed'}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true)
              }}
              fullWidth
              mt={'md'}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
