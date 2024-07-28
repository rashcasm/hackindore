import React, { useContext, useState, useEffect } from 'react'
import '../Styling/LandingPage.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import logo from '../Assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../custom-hooks/user'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [displayedText, setDisplayedText] = useState('')
  const [typing, setTyping] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fullText = 'Asset Management'
    let currentText = ''
    let index = 0

    const typeText = () => {
      if (index < fullText.length) {
        currentText += fullText[index]
        setDisplayedText(currentText)
        index++
      } else {
        setTimeout(() => {
          setDeleting(true)
          setTyping(false)
        }, 500) // Adjust delay before deleting text
      }
    }

    const deleteText = () => {
      if (index > 0) {
        currentText = currentText.slice(0,-1)
        setDisplayedText(currentText)
        index--
      } else {
        setTimeout(() => {
          setDeleting(false)
          setTyping(true)
        }, 700) // Adjust delay before re-typing text
      }
    }

    const intervalId = setInterval(() => {
      if (typing) {
        typeText()
      } else if (deleting) {
        deleteText()
      }
    }, 250) // Adjust typing/deleting speed as needed

    return () => clearInterval(intervalId)
  }, [typing, deleting])

  return (
    <>
      <Container fluid className='landing p-4'>
        <Row className=''>
          <div className='logos d-flex'>
            <img src={logo} alt="SEMA Logo" className="home-logo" width={250} height={250} />
          </div>
        </Row>

        <Row className='h-1/2'>
          <p className='text-white text-5xl md:text-6xl mt-5'>
            Best <br />
            <span className="typing-effect">{displayedText}</span> <br />
            Solution
          </p>
          <p className='text-white text-xl md:text-2xl mt-2'>Let us help you manage your assets in a <br /> simple, easy and secure way</p>
          <div>
            <button id='start-btn' type="button" className="inline-block px-4 py-3 bg-white text-dark font-medium font-bold uppercase rounded-lg shadow-md hover:shadow-2xl transition duration-150 ease-in-out"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default LandingPage
