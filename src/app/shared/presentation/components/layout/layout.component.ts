import { Component, OnInit } from '@angular/core';
import {HeaderContentComponent} from '../header-content/header-content.component';
import {FooterContentComponent} from '../footer-content/footer-content.component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  imports: [HeaderContentComponent, FooterContentComponent, MatIcon],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class  LayoutComponent implements OnInit{
  ngOnInit(): void {
  }

}
