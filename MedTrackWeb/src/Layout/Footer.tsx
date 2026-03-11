import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom whiteText blueBg">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <a
                        href="https://www.facebook.com/"
                        className="me-4 text-reset"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fa-brands fa-facebook"></i>
                    </a>

                </div>
            </section>
            <section className="">
                <div className="container-fluid p-4 m-0 text-center text-md-start blueBg whiteText">
                    <div className="row">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-gem me-3"></i>International General Hospital Joint Stock Company
                            </h6>
                            <p>
                                Here you can use rows and columns to organize your footer content. Lorem ipsum
                                dolor sit amet, consectetur adipisicing elit.
                            </p>
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Deparment</h6>
                            <div className="row row-cols-sm-4 row-cols-md-1 g-2">
                                <div className="col">
                                    <a href="#!" className="text-reset">General Medicine</a>
                                </div>
                                <div className="col">
                                    <a href="#!" className="text-reset">Dermatology</a>
                                </div>
                                <div className="col">
                                    <a href="#!" className="text-reset">Rehabilitation Medicine</a>
                                </div>
                                <div className="col">
                                    <a href="#!" className="text-reset">Obstetrics & Gynecology</a>
                                </div>
                                <div className="col">
                                    <a href="#!" className="text-reset">Pediatrics</a>
                                </div>
                                <div className="col">
                                    <a href="#!" className="text-reset">Odontology (Dentistry)</a>
                                </div>
                                <div className="col">
                                    <a href="#!" className="text-reset">Odontology</a>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Useful links
                            </h6>
                            <div className="row row-cols-sm-4 row-cols-md-1 g-2">
                                <div className="col"><Link to="services" className="text-reset">Pricing</Link></div>
                                <div className="col"><Link to="hservices" className="text-reset">Service</Link></div>
                                <div className="col"><a href="#!" className="text-reset">Orders</a></div>
                                <div className="col"><a href="#!" className="text-reset">Help</a></div>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 ">
                            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                            <p><i className="fas fa-home me-3"></i> Đại lộ Bình Dương, Khu Gò Cát, Phường Lái Thiêu, Thành phố Thuận An, Tỉnh Bình Dương, Việt Nam</p>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                contact@exmaplecapstone1.vn
                            </p>
                            <p><i className="fas fa-phone me-3"></i> + 	(0274)1231.345</p>
                            <p><i className="fas fa-print me-3"></i>(tax number) + 0123734812</p>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="m-0" />
            <div className="text-center p-4 blueBg whiteText">
                © 2025 Copyright:{" "}
                <a className="text-reset fw-bold" href="https://exmaplecapstone1.vn/">
                    exmaplecapstone1.vn
                </a>
            </div>
        </footer>
    )
}