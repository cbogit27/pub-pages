"use client"
import {
    EmailShareButton,
    EmailIcon,
    TwitterIcon,
    FacebookIcon,
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    WhatsappIcon,
  } from 'next-share'
  

export default function SocialsMobile() {
    return (
            <section className="flex md:hidden mt-2">
                
             <div className="flex space-x-2">
                <div>
                <TwitterShareButton
                    url={'https://github.com/next-share'}
                    title={'next-share is a social share buttons for your next React apps.'}
                    >
                    <TwitterIcon size={25} rectangle="true" />
                </TwitterShareButton>
                </div>
                <div>
                    <FacebookShareButton
                    url={'https://github.com/next-share'}
                    quote={'next-share is a social share buttons for your next React apps.'}
                    hashtag={'#nextshare'}
                    
                    >
                    <FacebookIcon size={25} rectangle="true"  />
                    </FacebookShareButton>
                </div>
                
                          
                <div>
                    <EmailShareButton
                        url={'https://github.com/next-share'}
                        subject={'Next Share'}
                        body="body"
                        >
                        <EmailIcon size={25} rectangle="true" />
                    </EmailShareButton>
                </div>
        
                <div>
                <WhatsappShareButton
                    url={'https://github.com/next-share'}
                    title={'next-share is a social share buttons for your next React apps.'}
                    separator=":: "
                    >
                    <WhatsappIcon size={25} rectangle="true"/>
                    </WhatsappShareButton>
                </div>
                </div>
    
            </section>
        )
}