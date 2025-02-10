import { mount } from '@vue/test-utils';
import CoursePage from '~/components/Course.vue';
import fetchMock from 'jest-fetch-mock';

describe('CoursePage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CoursePage, {
      data() {
        return {
          activeCourse: null, 
        }
      }
    });

    fetchMock.resetMocks();
  });
  
  it('deve atualizar activeCourse quando a consulta GraphQL for bem-sucedida', async () => {
    const mockCourse = { id: '123' };

    const mockResponse = {
      data: {
        provision: {
          id: '123',
          title: 'Curso Teste',
          description: 'Descrição do curso',
          url: 'https://example.com',
          format: 'video/mp4',
        },
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const wrapper = mount(CoursePage);

    await wrapper.vm.setActiveCourse(mockCourse);

    expect(wrapper.vm.activeCourse).toEqual({
      id: '123',
      title: 'Curso Teste',
      description: 'Descrição do curso',
      url: 'https://example.com',
      type: 'video/mp4',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/graphql',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('query')
      })
    );
  });

  it('renderiza a lista de cursos', () => {
    const courseTitles = wrapper.findAll('h5');
    expect(courseTitles.length).toBe(5);
    expect(courseTitles.at(0).text()).toBe('Introdução à Cultura Tech');
  });

  it('deve alternar o estado de conclusão do curso', async () => {
    const courseId = '4372ebd1-2ee8-4501-9ed5-549df46d0eb0';

    await wrapper.vm.toggleCompletion(courseId);
    expect(wrapper.vm.completedCourses).toContain(courseId);

    await wrapper.vm.toggleCompletion(courseId);
    expect(wrapper.vm.completedCourses).not.toContain(courseId);
  });

  it('deve calcular corretamente o progresso de estudo', async () => {
    wrapper.vm.completedCourses = ['4372ebd1-2ee8-4501-9ed5-549df46d0eb0', '26a42e72-cc93-44b3-acae-01537a36322b'];

    expect(wrapper.vm.progressPercentage).toBe(40);
  });
});
