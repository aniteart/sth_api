import fastify from 'fastify'
import { strict } from 'node:assert'
import crypto from 'node:crypto'

const server = fastify({
        logger: {
            transport: {
            target: 'pino-pretty',
            options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
    }
})

const courses = [
    { id: '1', title: 'Course A'},
    { id: '2', title: 'Course B'},
    { id: '3', title: 'Course C'},
]
//LISTAR CURSOS
server.get('/courses', () => {
    return courses
})

// LISTAR POR ID
server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params 
    const courseId = params.id
    const course = courses.find(course => course.id === courseId)

    if (!course) {
        return reply.status(404).send({ message: 'Course not found' })
    }

    return course
})

//CRIAR NOVO CURSO
server.post('/courses', (request, reply) => {
    type Body = {
        title: string
    }

    const body = request.body as Body
    const courseTitle = body.title

    const courseId = crypto.randomUUID()

    if(!courseTitle) {
        return reply.status(400).send({ message: 'Titulo obrigatório'})
    }

    courses.push({ id: courseId, title: courseTitle })

    return reply.status(201).send({ courseId })
})
//EDITAR CURSO
server.put('/courses/:id', (request, reply) => {
  const { id } = request.params as { id: string }
  const { title } = request.body as { title: string }

  const courseIndex = courses.findIndex(courses => courses.id === id)
  if (courseIndex === -1) {
    return reply.status(404).send({ message: 'Curso não encontrado' })
  }

  if (!title) {
    return reply.status(400).send({ message: 'Título obrigatório' })
  }

  courses[courseIndex].title = title
  return reply.send({ message: 'Curso editado com sucesso!' })
})

// DELETAR CURSO
server.delete('/courses/:id', (request, reply) => {
  const { id } = request.params as { id: string }

  const courseIndex = courses.findIndex(courses => courses.id === id)
  if (courseIndex === -1) {
    return reply.status(404).send({ message: 'Course not found' })
  }

  courses.splice(courseIndex, 1)
  return reply.send({ message: 'Curso deletado com sucesso' })
})

server.listen({ port: 3000}).then(() => {
    console.log('HTTP server running!')
})

