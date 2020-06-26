import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from "./mime-type.validator";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePerview: string;
  private mode = 'create';
  private postId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      'content': new FormControl(null, {
        validators: Validators.required,
      }),
      'image': new FormControl(null, {
        validators: Validators.required, asyncValidators: mimeType
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsSub = this.postsService.getPost(this.postId)
          .subscribe((postData) => { // what if postId doesn't exist?
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: null,
            };
            this.imagePerview = postData.imagePath;
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': postData.imagePath,
            });
          }, () => {
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    if (this.postsSub) this.postsSub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) return;
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePerview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // convention to start methord for event with a "on"
  onSavePost() {
    // if (this.form.invalid) return;
    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else if (this.mode == 'edit') {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image || this.post.imagePath,
      );
    }
    this.form.reset();
  }
}
