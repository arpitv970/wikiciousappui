import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Markdown from 'markdown-to-jsx';

const TermsOfUse = () => {
  const { t } = useTranslation('common')

  const [content, setContent] = useState<any>('');

  useEffect(() => {
    const fetchContentGitBook = async () => {
      try {

        const gitBookContent = await fetchContentGitBook();
        console.log('gitbook: ', gitBookContent)
        setContent(gitBookContent);
      } catch (error) {
        throw error
      }
    }
  }, [])

  return (
    <>
      <h1 className='font-bold'>{t('terms-of-use')}</h1>
      <Markdown>{content}</Markdown>
      <p className='mt-3'>Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.</p>
    </>
  )
}

export default TermsOfUse
