<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <nav class="text-sm text-gray-500 mb-6">
      <ul class="flex flex-wrap space-x-2">
        <li><a href="#" class="hover:text-gray-700">Meus cursos</a></li>
        <li>/</li>
        <li><a href="#" class="hover:text-gray-700">Player de conteúdos</a></li>
        <li>/</li>
        <li class="text-gray-700">Aulas</li>
      </ul>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div v-if="activeCourse" class="space-y-4">
          <!-- Title & Description -->
          <h3 class="text-lg font-semibold">{{ activeCourse.title }}</h3>
          <p v-if="activeCourse.description" class="text-sm text-gray-600">{{ activeCourse.description }}</p>

          <!-- Video -->
          <div v-if="activeCourse.type === 'mp4'" class="w-full aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <video :src="activeCourse.url" controls class="w-full h-full"></video>
          </div>

          <!-- PDF -->
          <div v-else-if="activeCourse && activeCourse.type === 'pdf'" class="bg-gray-200 rounded-lg p-4 text-center">
            <client-only>
              <pdf :src="pdfUrl" class="w-full h-screen"></pdf>
            </client-only>
          </div>
          
          <!-- Image -->
          <div v-else-if="activeCourse.type === 'png' || activeCourse.type === 'jpg'" class="bg-gray-200 rounded-lg overflow-hidden">
            <img :src="activeCourse.url" alt="Course Image" class="w-full h-auto object-cover">
          </div>

           <!-- TXT -->
           <div v-else-if="activeCourse.type === 'txt'" class="bg-gray-200 rounded-lg overflow-hidden">
            <iframe :src="activeCourse.url" style="width: 100%;"></iframe>
          </div>

          <!-- Link -->
          <div v-else class="bg-gray-200 rounded-lg p-4 text-center">
            <a :href="activeCourse.url" target="_blank" class="text-blue-600 underline">Open Link</a>
          </div>

      </div>

      <div v-else class="text-center text-gray-500">Selecione um curso para visualizar os detalhes.</div>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h4 class="text-sm font-semibold text-gray-700">Seu progresso de estudo</h4>
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ progressPercentage }}%</span>
              <span>100%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full">
              <div class="h-2 bg-purple-500 rounded-full" :style="{ width: `${progressPercentage}%` }"></div>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-4">
            Complete as aulas para progredir com o percentual.
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <h4 class="text-sm font-semibold text-gray-700">Aulas</h4>
          <div class="mt-4 space-y-2">
            <div 
              v-for="course in courses" 
              :key="course.id" 
              class="flex flex-col sm:flex-row items-center justify-between cursor-pointer p-3 rounded-lg border border-gray-200 hover:shadow-md transition"
              :class="{'bg-purple-50': activeCourse && activeCourse.id === course.id}"

              @click="setActiveCourse(course)"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full">
                  <span v-if="completedCourses.includes(course.id)" class="text-green-500">✔</span>
                  <span v-else class="text-gray-500">➖</span>
                </div>
                <div>
                  <h5 class="text-sm font-medium text-gray-700">{{ course.title }}</h5>
                </div>
              </div>
              <button 
                @click.stop="toggleCompletion(course.id)" 
                class="mt-2 sm:mt-0 text-xs font-medium px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600"
              >
                {{ completedCourses.includes(course.id) ? 'Completo' : 'Completar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CoursePage",
  data() {
    return {
      courses: [
        {
          id: "4372ebd1-2ee8-4501-9ed5-549df46d0eb0",
          title: "Introdução à Cultura Tech",
          description: "Uma imagem ilustrativa sobre a cultura de trabalho em equipe.",
          url: "http://localhost:3000/uploads/image1.jpg",
          type: "image",
        },
        {
          id: "26a42e72-cc93-44b3-acae-01537a36322b",
          title: "Ambiente de Trabalho Moderno",
          description: "Uma imagem representando espaços colaborativos e inovação nas empresas de tecnologia.",
          url: "http://localhost:3000/uploads/image2.png",
          type: "image",
        },
        {
          id: "7acff1c5-4c43-4923-a323-d22a12573041",
          title: "Guia de Boas Práticas em Desenvolvimento",
          description: "Um documento detalhado sobre boas práticas de programação e metodologias ágeis.",
          url: "http://localhost:3000/uploads/pdf1.pdf",
          type: "pdf",
        },
        {
          id: "3a5a94aa-17da-4e9a-b493-fe7e81294631",
          title: "Manual de Arquitetura de Software",
          description: "Um manual técnico abordando padrões arquiteturais e boas práticas para sistemas escaláveis.",
          url: "http://localhost:3000/uploads/pdf2.pdf",
          type: "pdf",
        },
        {
          id: "6969d6c7-40ea-4a3c-b635-d6546b971304",
          title: "Plataforma de Aprendizado Online",
          description: "Acesse este link para cursos e treinamentos voltados para tecnologia e inovação.",
          url: "https://learning.rocks",
          type: "link",
        },
        {
          id: "12ed0f9e-ff27-4052-99c5-2022a438e5ee",
          title: "Clean Code",
          description: "Clean Code na prática.",
          url: "http://localhost:3000/uploads/conteudo.txt?expires=1739136784&signature=3fbte",
          type: "txt",
		    },
        {
          id: "d060ab17-c961-4de7-929f-a0d52aa3ecf4",
          title: "Inteligência artificial",
          description: null,
          url: "http://localhost:3000/uploads/video1.mp4",
          type: "video",
        },
      ],
      activeCourse: null,
      completedCourses: [],
      mockToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8'
    };
  },
  computed: {
    progressPercentage() {
      return Math.round((this.completedCourses.length / this.courses.length) * 100);
    },
    pdfUrl() {
      return this.activeCourse ? this.activeCourse.url.replace(/^http:\/\/localhost:\d+\//, '') : "";
    }
  },
  methods: {
    async setActiveCourse(course) {
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.mockToken}`,
          },
          body: JSON.stringify({
            query: `query { 
              provision(content_id: "${course.id}") { 
                id 
                title 
                description 
                url 
                created_at 
                allow_download 
                is_embeddable 
                format 
                bytes 
                metadata 
              } 
            }`,
          }),
        });

        const result = await response.json();
        
        if (result.data && result.data.provision) {
          const provisionedContent = result.data.provision;

          this.activeCourse = {
            id: provisionedContent.id,
            title: provisionedContent.title,
            description: provisionedContent.description,
            url: provisionedContent.url,
            type: provisionedContent.format,
          };
        } else {
          console.error("Erro ao buscar dados do conteúdo.");
        }
      } catch (error) {
        console.error("Erro ao realizar a requisição GraphQL:", error);
      }
    },
    toggleCompletion(courseId) {
      const index = this.completedCourses.indexOf(courseId);
      if (index > -1) {
        this.completedCourses.splice(index, 1);
      } else {
        this.completedCourses.push(courseId);
      }
    },
  },
};
</script>

<style>
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
