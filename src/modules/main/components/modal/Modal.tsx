import React, {FunctionComponent, useState} from 'react';
import cl from './Modal.module.css'
import classNames from 'classnames';

interface OwnProps {
  isActive: boolean
  onClose: () => void,
  createPost: any,
  postList: Post[]
}

interface Post {
  name: string,
  adress: string,
  image: any,
  description: string
}

const Modal: FunctionComponent<OwnProps> = ({isActive, onClose, createPost, postList}) => {
  const [newPost, createNewPost] = useState<Post>({
    name: '', description: '', image: '', adress: ''
  })

  const submit = () => {
    createPost([...postList, newPost])
    createNewPost({name: '', image: '', adress: '', description: ''})
    onClose()
  }

  return (
    <div className={classNames(`${cl.modal} ${isActive && cl.active}`)}
         onClick={(e: React.MouseEvent<HTMLDivElement>) => {
           onClose()
         }}>
      <div className='py-6 px-4 bg-white rounded-md w-[500px] relative flex items-center justify-center flex-col'
           onClick={(e) => e.stopPropagation()}>
        <button className='absolute right-[10px] top-[10px] text-[12px]' onClick={onClose}>Закрыть</button>
        <h1 className='text-blue-400 text-[24px]'>Создание организации</h1>
        <form onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
              className='flex-col flex items-start justify-center text-blue-400 text-[14px] w-full'
        >
          <label>Название</label>
          <input
            type="text"
            className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
            value={newPost.name}
            onChange={(e) => createNewPost({...newPost, name: e.target.value})}
          />
          <label>Описание</label>
          <input
            type="text"
            className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
            value={newPost.description}
            onChange={(e) => createNewPost({...newPost, description: e.target.value})}
          />
          <label>Изображение</label>
          <input
            type="file"
            className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0]
                let reader = new FileReader()

                reader.readAsDataURL(file)
                reader.onload = () => {
                  createNewPost({...newPost, image: reader.result})
                }
              }

            }}
          />
          <label>Адрес</label>
          <input
            type="text"
            className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
            value={newPost.adress}
            onChange={(e) => createNewPost({...newPost, adress: e.target.value})}
          />
          <button className='w-full bg-blue-400 rounded-md text-white py-2 mt-4'>Создать</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;