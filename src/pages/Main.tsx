import  {FunctionComponent, useState} from 'react';
import Modal from "../modules/main/components/modal/Modal.tsx";
import NavBar from '../components/navbar/NavBar.tsx';

interface OwnProps {
}

interface Post {
  name: string,
  description: string,
  image: any,
  adress: any
}

type Props = OwnProps;

const Main: FunctionComponent<Props> = (props) => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [postList, addPost] = useState<Post[]>([
  ])

  const closeModal = () => setIsModalOpen(false)


  return (
    <section>
      <Modal isActive={isModalOpen} onClose={closeModal} createPost={addPost} postList={postList}/>
      <div className='w-full flex flex-row ml-auto mr-10 bg-[#19181C]'>
        <NavBar/>
        <div className='w-full flex flex-col'>
          <div className='w-full bg-[#19181C] py-8 flex justify-between px-8 mb-4 '>
            <p className='h1-35-400'>Список организаций</p>
            <button
              className="w-[200px] h-[45px] rounded-[10px] h1-16-400 bg-[#2847A2] hover:bg-[#233D8B]"
              onClick={
                () => setIsModalOpen(true)
              }
            >
              Добавить
            </button>
          </div>
          <div className='flex w-full flex-wrap px-4 py-4 '>
            {
              postList.map((post: Post) =>
                <div className='h-[450px] w-[350px] border-1 border-gray-600 border rounded-md mx-4 mb-4 p-2 flex-col justify-between items-start flex' key={postList.indexOf(post)} >
                  <img src={post.image} alt="" className='h-[200px] w-full object-cover mb-4 rounded-md' />
                  <h1 className='h1-22-400 !text-blue-400 mb-4 w-full break-words'>{post.name}</h1>
                  <p className='text-[18px] h1-18-400 mb-4 w-full'>{post.description}</p>
                  <p className='text-[16px] h1-16-400 mb-4 w-full'>{post.adress}</p>
                  <button className='bg-red-500 rounded-[12px] w-full py-2 ' onClick={() => addPost([...postList.filter((e) => postList.indexOf(e) !== postList.indexOf(post))]) }><p className='h1-16-400'>Удалить</p></button>
                </div>
              )
            }


          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
