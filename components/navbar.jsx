import React from "react";
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const Navbar = () => {
    

    return (
        <div id="header" className="container mt-4">
            <div className="row">
                <div className="col-sm-6 col-12">
                    <h2><Link href="/" style={{ color: "black", textDecoration: "none" }}>Daily Progress System! </Link></h2>
                </div>
                <div className="col-sm-6 col-12 d-flex align-items-center justify-content-end">
                    <div className="row d-flex justify-content-end align-items-center">
                        <div className="col-auto mb-1">
                            {
                              
                                    <div className="dropdown-dashboard">
                                        <Link href="/" className="btn btn-primary">Dashboard</Link>
                                    </div>
                   
                            }
                        </div>
                       
                        <div className="col-auto mb-1">
                           
                                <Link href="" className="btn btn-secondary">Settings</Link>
                        
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}

export default Navbar;