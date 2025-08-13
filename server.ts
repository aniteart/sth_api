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

server.listen({ port: 3000}).then(() => {
    console.log('HTTP server running!')
})

