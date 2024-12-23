"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';

import Container from '@mui/material/Container';

import Button from '@mui/material/Button';

import AdbIcon from '@mui/icons-material/Adb';

const pages: {
  path: string,
  title: string
}[] = [{
  path: "/record",
  title: "Ghi hình"
}, {
  path: "/labeling",
  title: "Gán nhãn"
}];


export function ResponsiveAppBar() {
 
  // const navigate = (path: string) => {
  //   window.location.replace("path")
  // }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PIR WIZARD
          </Typography>

        
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
              
                key={page.path}
                
                
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={page.path}
              >
                {page.title}
               
                
              </Button>
            ))}
          </Box>
         
        </Toolbar>
      </Container>
    </AppBar>
  );
}

