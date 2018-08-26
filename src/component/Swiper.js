import  React from 'react';
import Swiper from 'swiper'
import "swiper/dist/css/swiper.css"


export class ReactSwiper extends React.Component {

    componentDidMount() {


        setTimeout(() => {


            new Swiper(".swiper-container", {
                autoplay: 0,
                pagination: {
                    el:".swiper-pagination"
                },
                paginationClickable: true,
                observer: true,
                lazyLoading: true
            });

        }, 50)
    }

    render() {
        let swipes = this.props.swipes
        return <div className="swiper-container">
            <div className="swiper-wrapper">
                {

                    swipes.map((item, index) => {


                        return <div className="swiper-lazy swiper-slide"
                                    style={item.style}
                                    key={index}
                        >
                            <div className="swiper-item-heading">
                                <div className="text">{item.title}</div>
                            </div>
                        </div>

                    })

                }
            </div>
            <div className="swiper-pagination">
            </div>
        </div>

    }

}